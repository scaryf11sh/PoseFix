import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import time
import math

# --- CONFIGURACIÓN ---
result_list = []

def res_callback(result, output_image, timestamp_ms):
    if result.pose_landmarks:
        result_list.append(result)

options = vision.PoseLandmarkerOptions(
    base_options=python.BaseOptions(model_asset_path="pose_landmarker_full.task"),
    running_mode=vision.RunningMode.LIVE_STREAM,
    result_callback=res_callback
)
landmark = vision.PoseLandmarker.create_from_options(options)

def calculate_angle(p1, p2):
    """Calcula el ángulo en grados entre dos puntos (x, y)."""
    return math.degrees(math.atan2(p2[1] - p1[1], p2[0] - p1[0]))

cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret: break

    h, w, _ = frame.shape
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)

    landmark.detect_async(mp_image, time.time_ns() // 1_000_000)

    if result_list:
        res = result_list.pop(0)
        for poses in res.pose_landmarks:
            # Función auxiliar para convertir a píxeles
            def to_pixel(lm):
                return int(lm.x * w), int(lm.y * h)

            # Obtener puntos clave
            # 0: Nariz, 7: Oreja Izq, 8: Oreja Der, 11: Hombro Izq, 12: Hombro Der
            nose = to_pixel(poses[0])
            ear_l = to_pixel(poses[7])
            ear_r = to_pixel(poses[8])
            shoulder_l = to_pixel(poses[11])
            shoulder_r = to_pixel(poses[12])

            # Puntos medios
            shoulder_mid = ((shoulder_l[0] + shoulder_r[0]) // 2, (shoulder_l[1] + shoulder_r[1]) // 2)
            ear_mid = ((ear_l[0] + ear_r[0]) // 2, (ear_l[1] + ear_r[1]) // 2)

            # --- CÁLCULOS MEJORADOS ---
            
            # 1. Nivel de Hombros (Ángulo respecto a la horizontal)
            # Idealmente 0 grados.
            angle_shoulders = calculate_angle(shoulder_l, shoulder_r)
            
            # 2. Inclinación del Cuello (Desviación respecto a la vertical)
            # Vector desde el centro de hombros al centro de orejas/cabeza
            # En imagen, Y crece hacia abajo. Vertical hacia arriba es -90 grados.
            angle_neck_raw = calculate_angle(shoulder_mid, ear_mid)
            neck_deviation = angle_neck_raw + 90  # 0 si es vertical

            # Umbrales
            THRESHOLD_SHOULDER = 5.0
            THRESHOLD_NECK = 10.0

            is_shoulders_ok = abs(angle_shoulders) < THRESHOLD_SHOULDER
            is_neck_ok = abs(neck_deviation) < THRESHOLD_NECK

            # Color de estado (Verde = OK, Rojo = Mal)
            color_status = (0, 255, 0) if (is_shoulders_ok and is_neck_ok) else (0, 0, 255)

            # --- DIBUJO DEL ESQUELETO MEJORADO ---
            # Estilo más limpio y minimalista
            
            # 1. Línea de Hombros (Base)
            cv2.line(frame, shoulder_l, shoulder_r, color_status, 3)
            
            # 2. Triángulo del Cuello (Trapecios visuales)
            # Conecta hombros con la base del cuello (ear_mid) para dar forma
            cv2.line(frame, shoulder_l, ear_mid, color_status, 2)
            cv2.line(frame, shoulder_r, ear_mid, color_status, 2)
            
            # 3. Línea Central (Columna Cervical)
            # Desde el centro de hombros hasta la nariz (eje de la cabeza)
            cv2.line(frame, shoulder_mid, nose, color_status, 3)

            # 4. Línea de Ojos/Orejas (Nivel de la cabeza)
            cv2.line(frame, ear_l, ear_r, color_status, 2)

            # Puntos clave (Articulaciones) - Estilo "Hollow" (Hueco)
            for pt in [shoulder_l, shoulder_r, shoulder_mid, ear_l, ear_r, nose]:
                cv2.circle(frame, pt, 5, (255, 255, 255), -1) # Relleno blanco
                cv2.circle(frame, pt, 6, color_status, 2)     # Borde de color de estado

            # --- VISUALIZACIÓN DE DATOS (HUD) ---
            # Fondo semitransparente para el texto
            overlay = frame.copy()
            cv2.rectangle(overlay, (10, 10), (350, 160), (0, 0, 0), -1)
            cv2.addWeighted(overlay, 0.6, frame, 0.4, 0, frame)

            # Textos informativos
            font = cv2.FONT_HERSHEY_SIMPLEX
            
            # Título
            cv2.putText(frame, "MONITOR DE POSTURA", (20, 40), font, 0.7, (255, 255, 255), 2)
            
            # Datos numéricos
            color_sh = (0, 255, 0) if is_shoulders_ok else (0, 0, 255)
            color_nk = (0, 255, 0) if is_neck_ok else (0, 0, 255)
            
            cv2.putText(frame, f"Hombros: {angle_shoulders:.1f} deg", (20, 80), font, 0.6, color_sh, 1)
            cv2.putText(frame, f"Cuello:  {neck_deviation:.1f} deg", (20, 110), font, 0.6, color_nk, 1)

            # Alertas
            msg_y = 145
            if not is_shoulders_ok:
                cv2.putText(frame, "¡NIVELA HOMBROS!", (20, msg_y), font, 0.7, (0, 0, 255), 2)
            elif not is_neck_ok:
                cv2.putText(frame, "¡ENDEREZA CUELLO!", (20, msg_y), font, 0.7, (0, 0, 255), 2)
            else:
                cv2.putText(frame, "POSTURA CORRECTA", (20, msg_y), font, 0.7, (0, 255, 0), 2)

    cv2.imshow("ErgoGuard AI - Monitor de Postura", frame)
    if cv2.waitKey(1) & 0xFF == ord('q'): break

cap.release()
cv2.destroyAllWindows()
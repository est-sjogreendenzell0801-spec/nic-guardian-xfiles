import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { X, Send, MessageCircle, Search, Phone, MapPin, AlertTriangle, Lightbulb } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  category?: string
}

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  keywords: string[]
}

// Base de conocimiento FAQ organizada por categorías
const faqDatabase: FAQItem[] = [
  // Categoría 1: Desastres naturales en Masaya (1-10)
  {
    id: '1',
    question: '¿Qué desastres naturales pueden ocurrir en Masaya?',
    answer: 'En Masaya pueden ocurrir sismos debido a la alta actividad sísmica de la región del Pacífico de Nicaragua, erupciones del Volcán Masaya, inundaciones leves durante la temporada lluviosa, y afectan indirectamente tormentas o huracanes del Caribe. Además, hay baja amenaza de caída de cenizas volcánicas.',
    category: 'Desastres en Masaya',
    keywords: ['desastres', 'masaya', 'tipos', 'naturales', 'sismos', 'volcano', 'inundaciones']
  },
  {
    id: '2',
    question: '¿Con qué frecuencia ocurren los sismos en Masaya?',
    answer: 'Masaya experimenta sismos con frecuencia variable, incluidos pequeños temblores diarios y eventos más fuertes ocasionales con magnitudes entre 2.7 y 6.0 Richter. Esta actividad está ligada a fallas geológicas de la región.',
    category: 'Desastres en Masaya',
    keywords: ['sismos', 'frecuencia', 'temblores', 'richter', 'masaya', 'cuanto', 'terremoto', 'movimiento telúrico', 'movimiento sísmico', 'sacudida tectónica', 'réplica sísmica', 'temblor', 'sacudida', 'sacudión', 'movida de tierra', 'estremecida', 'tierra temblando', 'movimiento de piso', 'la tierra se movió', 'temblorazo', 'estremón']
  },
  {
    id: '3',
    question: '¿Por qué el Volcán Masaya es peligroso?',
    answer: 'El Volcán Masaya es uno de los más activos de Centroamérica, con un cráter permanente que emite gases tóxicos, principalmente dióxido de azufre. Puede provocar erupciones explosivas, emisión de cenizas y flujos de lava que amenazan a las comunidades cercanas.',
    category: 'Desastres en Masaya',
    keywords: ['volcan', 'masaya', 'peligroso', 'gases', 'erupcion', 'cenizas', 'volcán bravo', 'volcán botando humo', 'volcán tirando fuego', 'volcán echando vapor', 'volcán despierto', 'volcán rugiendo', 'volcán haciendo ruido', 'volcán echando piedra', 'actividad volcánica', 'explosión volcánica', 'emisión de ceniza', 'gases volcánicos', 'flujo de lava', 'cráter en actividad', 'fumarola', 'actividad sísmica volcánica']
  },
  {
    id: '4',
    question: '¿Qué tan frecuente son las inundaciones en la ciudad?',
    answer: 'Las inundaciones en Masaya son frecuentes pero de baja intensidad, generalmente con niveles de agua menores a 0.5 metros. Incrementan en temporada lluviosa debido a fallas en el sistema de drenaje pluvial y la acumulación de aguas.',
    category: 'Desastres en Masaya',
    keywords: ['inundaciones', 'frecuencia', 'lluvias', 'agua', 'drenaje', 'crecida de río', 'desbordamiento de río', 'anegamiento', 'desborde de laguna', 'desbordamiento pluvial', 'lluvias torrenciales', 'aniego', 'palo de agua', 'calle hecha río', 'barrio bajo anegado', 'agua que se mete a las casas', 'agua al tope', 'lluvia que no para', 'agua desbordada', 'río salido', 'agua que tapa todo', 'lluvia brava']
  },
  {
    id: '5',
    question: '¿Masaya corre riesgo de huracanes?',
    answer: 'Masaya está en riesgo indirecto por huracanes que se formen en el Caribe y generen lluvias intensas y vientos fuertes aunque no se ubique en la ruta directa de huracanes del Pacífico.',
    category: 'Desastres en Masaya',
    keywords: ['huracanes', 'riesgo', 'caribe', 'vientos', 'lluvia', 'ciclón tropical', 'tormenta ciclónica', 'tormenta tropical intensa', 'tormenta de gran escala', 'sistema tropical', 'depresión tropical', 'temporal grande', 'temporalón', 'tormentón', 'viento huracanado', 'viento bravo', 'ciclón', 'tormenta que arrasa', 'tormenta del mar', 'viento de mar fuerte', 'lluvia con viento fuerte', 'vendaval']
  },

  // Categoría 2: Preparación para sismos (11-20)
  {
    id: '11',
    question: '¿Qué debo hacer si hay un sismo?',
    answer: 'Mantener la calma, protegerse bajo muebles robustos o marco de puertas, alejarse de ventanas y objetos que puedan caer.',
    category: 'Preparación Sismos',
    keywords: ['sismo', 'que hacer', 'protegerse', 'muebles', 'ventanas', 'terremoto', 'movimiento telúrico', 'movimiento sísmico', 'sacudida tectónica', 'réplica sísmica', 'temblor', 'sacudida', 'sacudión', 'movida de tierra', 'estremecida', 'tierra temblando', 'movimiento de piso', 'la tierra se movió', 'temblorazo', 'estremón']
  },
  {
    id: '12',
    question: '¿Cómo identificar zonas seguras en casa durante un sismo?',
    answer: 'Zonas bajo mesas, escritorios, o contra paredes interiores lejos de ventanas y objetos pesados.',
    category: 'Preparación Sismos',
    keywords: ['zonas seguras', 'casa', 'mesas', 'paredes', 'interiores']
  },
  {
    id: '13',
    question: '¿Qué objetos debo asegurar antes de un temblor?',
    answer: 'Asegurar muebles altos, electrodomésticos, lámparas y objetos que puedan caer y causar daño.',
    category: 'Preparación Sismos',
    keywords: ['asegurar', 'muebles', 'electrodomésticos', 'objetos', 'prevención']
  },
  {
    id: '17',
    question: '¿Cómo armar un kit de emergencia para un sismo?',
    answer: 'Incluir agua potable, alimentos no perecederos, linterna, radio, medicamentos, documentos importantes y ropa.',
    category: 'Preparación Sismos',
    keywords: ['kit', 'emergencia', 'agua', 'alimentos', 'linterna', 'radio']
  },

  // Categoría 3: Prevención volcánica (21-30)
  {
    id: '21',
    question: '¿Qué gases emite el Volcán Masaya?',
    answer: 'Principalmente dióxido de azufre (SO2), dióxido de carbono (CO2) y vapor de agua.',
    category: 'Prevención Volcánica',
    keywords: ['gases', 'volcan', 'azufre', 'co2', 'vapor']
  },
  {
    id: '22',
    question: '¿Qué hacer si hay ceniza volcánica en la ciudad?',
    answer: 'Usar mascarilla adecuada, cerrar ventanas y evitar actividades al aire libre.',
    category: 'Prevención Volcánica',
    keywords: ['ceniza', 'mascarilla', 'ventanas', 'aire libre']
  },
  {
    id: '25',
    question: '¿Qué tipo de mascarilla es adecuada contra la ceniza?',
    answer: 'Mascarillas N95 o similares que filtren partículas pequeñas.',
    category: 'Prevención Volcánica',
    keywords: ['mascarilla', 'n95', 'filtro', 'partículas']
  },

  // Categoría 4: Prevención inundaciones (31-40)
  {
    id: '31',
    question: '¿Cuándo suelen ocurrir las inundaciones en Masaya?',
    answer: 'Durante la temporada lluviosa, especialmente cuando las lluvias son intensas y prolongadas, se presentan inundaciones en zonas bajas y con drenaje deficiente.',
    category: 'Prevención Inundaciones',
    keywords: ['inundaciones', 'temporada', 'lluvias', 'zonas bajas', 'cuando']
  },
  {
    id: '32',
    question: '¿Cómo saber si mi casa está en zona de riesgo de inundación?',
    answer: 'Consultando mapas de riesgo elaborados por INETER y SINAPRED, que detallan áreas inundables en el casco urbano de Masaya.',
    category: 'Prevención Inundaciones',
    keywords: ['zona riesgo', 'casa', 'mapas', 'ineter', 'sinapred']
  },
  {
    id: '37',
    question: '¿Qué hacer si el agua sube rápidamente en casa?',
    answer: 'Evacuar de inmediato y dirigirse a zonas altas o refugios recomendados.',
    category: 'Prevención Inundaciones',
    keywords: ['agua sube', 'evacuar', 'zonas altas', 'refugios']
  },

  // Categoría 5: Números de emergencia y contactos
  {
    id: 'emergency1',
    question: '¿Cuáles son los números de emergencia en Nicaragua?',
    answer: 'Principales números: Policía Nacional (118), Bomberos (115), Central de Ambulancias (102), Cruz Blanca (128), SINAPRED (100), Defensa Civil (2228-9915), ENACAL (127).',
    category: 'Números de Emergencia',
    keywords: ['emergencia', 'números', 'policía', 'bomberos', 'ambulancia', 'contactos']
  },
  {
    id: 'emergency2',
    question: '¿A quién llamar en caso de emergencia volcánica?',
    answer: 'SINAPRED (100) para emergencias de desastres naturales, o Bomberos (115) para evacuaciones inmediatas.',
    category: 'Números de Emergencia',
    keywords: ['emergencia', 'volcánica', 'sinapred', 'bomberos', 'evacuación']
  },

  // Categoría 6: Kits de emergencia (61-70)
  {
    id: '61',
    question: '¿Qué debe incluir un kit de emergencia?',
    answer: 'Agua potable, alimentos no perecederos, medicamentos básicos, linterna, radio, botiquín, documentos y ropa.',
    category: 'Kits de Emergencia',
    keywords: ['kit', 'emergencia', 'agua', 'alimentos', 'medicamentos', 'linterna']
  },
  {
    id: '62',
    question: '¿Cuánta agua debo almacenar por persona?',
    answer: 'Al menos 3 litros diarios por persona para un mínimo de 3 días.',
    category: 'Kits de Emergencia',
    keywords: ['agua', 'almacenar', 'litros', 'persona', 'días']
  },
  {
    id: '67',
    question: '¿Dónde guardar el kit de emergencia en casa?',
    answer: 'En un lugar accesible y conocido por todos los miembros de la familia.',
    category: 'Kits de Emergencia',
    keywords: ['guardar', 'kit', 'casa', 'accesible', 'familia']
  },

  // Más preguntas sobre educación y señales de alerta
  {
    id: '71',
    question: '¿Cómo enseñar a los niños sobre desastres naturales?',
    answer: 'Mediante simulacros, juegos educativos y explicaciones claras sobre qué hacer en cada evento.',
    category: 'Educación',
    keywords: ['niños', 'enseñar', 'simulacros', 'juegos', 'educación']
  },
  {
    id: '81',
    question: '¿Cómo reconocer un riesgo inminente de sismo?',
    answer: 'No hay signos precisos, pero repuntes sísmicos o sacudidas fuertes indican actividad.',
    category: 'Señales de Alerta',
    keywords: ['riesgo', 'sismo', 'signos', 'sacudidas', 'reconocer']
  },

  // Preguntas sobre la aplicación Guardian Nica
  {
    id: 'app1',
    question: '¿Qué es Guardian Nica?',
    answer: 'Guardian Nica es una aplicación educativa sobre amenazas meteorológicas que incluye un sistema de alertas basado en geolocalización para usuarios en Nicaragua. Permite reportar eventos en tiempo real y contiene contenido educativo sobre prevención.',
    category: 'Sobre Guardian Nica',
    keywords: ['guardian nica', 'aplicación', 'alertas', 'geolocalización', 'reportar']
  },
  {
    id: 'app2',
    question: '¿Cómo reportar un evento en Guardian Nica?',
    answer: 'Ve a la sección "Reportar" 🐜📱, selecciona el tipo de evento, describe lo que observaste, agrega tu ubicación y envía el reporte. Será verificado por nuestro equipo.',
    category: 'Sobre Guardian Nica',
    keywords: ['reportar', 'evento', 'sección', 'ubicación', 'verificado']
  },
  {
    id: 'app3',
    question: '¿Cómo funciona el mapa interactivo?',
    answer: 'En la sección "Mapa" puedes ver eventos reportados en tiempo real en Masaya, hacer reportes clickeando zonas, y ver estadísticas de cada área.',
    category: 'Sobre Guardian Nica',
    keywords: ['mapa', 'interactivo', 'eventos', 'tiempo real', 'estadísticas']
  },

  // Preguntas sobre deslaves y derrumbes
  {
    id: 'deslaves1',
    question: '¿Qué son los deslaves y por qué ocurren?',
    answer: 'Los deslaves son movimientos de tierra, rocas y vegetación pendiente abajo. En Nicaragua ocurren principalmente por lluvias intensas que saturan el suelo, deforestación, construcciones en pendientes y actividad sísmica. Las zonas montañosas son más vulnerables.',
    category: 'Prevención Deslaves',
    keywords: ['deslaves', 'deslizamientos', 'tierra', 'lluvia', 'pendiente', 'que son']
  },
  {
    id: 'deslaves2',
    question: '¿Cuáles son las señales de peligro de deslaves?',
    answer: 'Señales de alerta: grietas en el suelo, inclinación de árboles o postes, agua turbia en manantiales, sonidos de rocas cayendo, aparición de manantiales donde no había, y grietas en paredes de casas en laderas.',
    category: 'Prevención Deslaves',
    keywords: ['señales', 'peligro', 'grietas', 'árboles', 'agua turbia', 'sonidos']
  },
  {
    id: 'deslaves3',
    question: '¿Qué hacer durante un deslave?',
    answer: 'Durante un deslave: evacuá inmediatamente hacia zonas altas y estables, alejate de la trayectoria del deslizamiento, no corras cuesta abajo, si estás en un vehículo salí rápidamente, y mantente alejado de ríos que puedan represarse.',
    category: 'Prevención Deslaves',
    keywords: ['durante', 'deslave', 'evacuar', 'zonas altas', 'vehículo', 'ríos']
  },
  {
    id: 'derrumbes1',
    question: '¿Qué diferencia hay entre deslaves y derrumbes?',
    answer: 'Los deslaves son movimientos de tierra saturada de agua que fluye como lodo. Los derrumbes son caídas súbitas de rocas, piedras o material sólido desde acantilados o paredes rocosas, usualmente por erosión, sismos o lluvia.',
    category: 'Prevención Derrumbes',
    keywords: ['diferencia', 'deslaves', 'derrumbes', 'rocas', 'tierra', 'lodo']
  },
  {
    id: 'derrumbes2',
    question: '¿Cómo prevenir derrumbes cerca de mi casa?',
    answer: 'Para prevenir derrumbes: no construir cerca de acantilados, mantener drenajes limpios, plantar vegetación que estabilice el suelo, evitar excavaciones cerca de pendientes, y revisar regularmente grietas en paredes rocosas.',
    category: 'Prevención Derrumbes',
    keywords: ['prevenir', 'casa', 'acantilados', 'drenajes', 'vegetación', 'excavaciones']
  },
  {
    id: 'lluvia_deslaves',
    question: '¿Cuánta lluvia puede causar deslaves?',
    answer: 'En Nicaragua, lluvias superiores a 100mm en 24 horas en suelos saturados pueden provocar deslaves. Durante huracanes o temporadas lluviosas intensas, el riesgo aumenta significativamente, especialmente en las montañas del norte.',
    category: 'Prevención Deslaves',
    keywords: ['lluvia', 'cantidad', 'mm', 'huracanes', 'temporada', 'montañas']
  },

  // Categoría 11: Deslaves y Derrumbes - Nuevas preguntas detalladas
  {
    id: 'que_es_deslave',
    question: '¿Qué es un deslave?',
    answer: 'Un deslave es el desprendimiento de tierra, rocas o lodo en laderas, generalmente provocado por lluvias intensas, saturación del suelo o movimientos sísmicos.',
    category: 'Deslaves y Derrumbes',
    keywords: ['deslave', 'desprendimiento', 'tierra', 'rocas', 'lodo', 'laderas', 'lluvia', 'saturación', 'deslizamiento de tierra', 'avalancha de lodo', 'caída de talud', 'flujo de lodo', 'lahares', 'corrimiento de tierra', 'tierra que se viene abajo', 'barranco que se cayó', 'lodo bajando', 'tierra floja', 'cerro que se viene', 'tierra que rueda', 'bajada de lodo', 'caída de cerro']
  },
  {
    id: 'que_es_derrumbe',
    question: '¿Qué es un derrumbe?',
    answer: 'Un derrumbe es la caída repentina de tierra, rocas o estructuras en una pendiente, normalmente por erosión, lluvia o actividad sísmica.',
    category: 'Deslaves y Derrumbes',
    keywords: ['derrumbe', 'caída', 'repentina', 'pendiente', 'erosión', 'sísmica', 'deslizamiento de tierra', 'avalancha de lodo', 'caída de talud', 'flujo de lodo', 'lahares', 'corrimiento de tierra', 'tierra que se viene abajo', 'barranco que se cayó', 'lodo bajando', 'tierra floja', 'cerro que se viene', 'tierra que rueda', 'bajada de lodo', 'caída de cerro']
  },
  {
    id: 'masaya_deslaves_riesgo',
    question: '¿Masaya es propensa a deslaves o derrumbes?',
    answer: 'Sí, en zonas de laderas volcánicas o áreas con suelos inestables, sobre todo durante la temporada lluviosa.',
    category: 'Deslaves y Derrumbes',
    keywords: ['masaya', 'propensa', 'laderas', 'volcánicas', 'suelos', 'inestables', 'temporada', 'lluviosa']
  },
  {
    id: 'señales_deslave',
    question: '¿Cuáles son las señales de un posible deslave?',
    answer: 'Grietas en el suelo, inclinación de árboles o postes, agua turbia que brota del terreno y ruidos de movimiento de tierra.',
    category: 'Deslaves y Derrumbes',
    keywords: ['señales', 'grietas', 'suelo', 'inclinación', 'árboles', 'postes', 'agua', 'turbia', 'ruidos']
  },
  {
    id: 'sospecha_deslave_casa',
    question: '¿Qué hacer si sospecho de un deslave cerca de mi casa?',
    answer: 'Evacuar de inmediato, avisar a las autoridades y mantenerse alejado de pendientes o taludes.',
    category: 'Deslaves y Derrumbes',
    keywords: ['sospecho', 'cerca', 'casa', 'evacuar', 'inmediato', 'avisar', 'autoridades', 'alejado', 'pendientes', 'taludes']
  },
  {
    id: 'prevenir_deslaves_zonas_riesgo',
    question: '¿Cómo prevenir deslaves en zonas de riesgo?',
    answer: 'No construir en laderas inestables, mantener drenajes limpios, reforestar y reforzar muros de contención.',
    category: 'Deslaves y Derrumbes',
    keywords: ['prevenir', 'zonas', 'riesgo', 'construir', 'laderas', 'inestables', 'drenajes', 'limpios', 'reforestar', 'muros', 'contención']
  },
  {
    id: 'durante_derrumbe',
    question: '¿Qué hacer durante un derrumbe?',
    answer: 'Alejarse lo más rápido posible, buscar terreno plano y no regresar hasta que las autoridades indiquen que es seguro.',
    category: 'Deslaves y Derrumbes',
    keywords: ['durante', 'derrumbe', 'alejarse', 'rápido', 'terreno', 'plano', 'autoridades', 'seguro']
  },
  {
    id: 'kit_zonas_deslaves',
    question: '¿Qué kit es útil en zonas con riesgo de deslaves?',
    answer: 'El mismo de emergencias: agua, alimentos no perecederos, linterna, radio, botiquín y documentos.',
    category: 'Deslaves y Derrumbes',
    keywords: ['kit', 'útil', 'zonas', 'riesgo', 'emergencias', 'agua', 'alimentos', 'linterna', 'radio', 'botiquín', 'documentos']
  },
  {
    id: 'lluvia_afecta_deslaves',
    question: '¿Cómo afecta la lluvia a los deslaves?',
    answer: 'Las lluvias intensas saturan el suelo, haciéndolo más pesado y aumentando el riesgo de que la tierra se desplace.',
    category: 'Deslaves y Derrumbes',
    keywords: ['lluvia', 'afecta', 'saturan', 'suelo', 'pesado', 'aumentando', 'riesgo', 'tierra', 'desplace']
  },
  {
    id: 'atrapado_deslave',
    question: '¿Qué hacer si quedo atrapado por un deslave?',
    answer: 'Buscar refugio bajo estructuras firmes, proteger la cabeza, mantener la calma y pedir ayuda si es posible.',
    category: 'Deslaves y Derrumbes',
    keywords: ['atrapado', 'deslave', 'refugio', 'estructuras', 'firmes', 'proteger', 'cabeza', 'calma', 'ayuda']
  },

  // Categoría 12: Respuestas automáticas para fenómenos específicos
  {
    id: 'fenomeno_terremoto',
    question: 'Terremoto',
    answer: 'Un terremoto es un movimiento brusco de la corteza terrestre.\n👉 Recomendación: Protégete bajo muebles fuertes, cúbrete la cabeza, aléjate de ventanas y espera a que pase el movimiento.',
    category: 'Fenómenos Naturales',
    keywords: ['terremoto', 'sismo', 'temblor', 'movimiento telúrico', 'movimiento sísmico', 'sacudida tectónica', 'réplica sísmica', 'sacudida', 'sacudión', 'movida de tierra', 'estremecida', 'tierra temblando', 'movimiento de piso', 'la tierra se movió', 'temblorazo', 'estremón']
  },
  {
    id: 'fenomeno_erupcion',
    question: 'Erupción volcánica',
    answer: 'Una erupción volcánica es la expulsión de gases, cenizas, lava o rocas desde un volcán.\n👉 Recomendación: Usa mascarilla N95, cierra ventanas y sigue las órdenes de evacuación si las autoridades lo indican.',
    category: 'Fenómenos Naturales',
    keywords: ['erupción', 'volcánica', 'volcán', 'ceniza', 'lava', 'actividad volcánica', 'explosión volcánica', 'emisión de ceniza', 'gases volcánicos', 'flujo de lava', 'cráter en actividad', 'fumarola', 'actividad sísmica volcánica', 'volcán bravo', 'volcán botando humo', 'volcán tirando fuego', 'volcán echando vapor', 'volcán despierto', 'volcán rugiendo', 'volcán haciendo ruido', 'volcán echando piedra']
  },
  {
    id: 'fenomeno_inundacion',
    question: 'Inundación',
    answer: 'Una inundación es la acumulación de agua que cubre zonas habitadas.\n👉 Recomendación: Evita cruzar corrientes de agua, desconecta la electricidad y evacúa a zonas altas si el agua sube.',
    category: 'Fenómenos Naturales',
    keywords: ['inundación', 'agua', 'inundar', 'crecida de río', 'desbordamiento de río', 'anegamiento', 'desborde de laguna', 'desbordamiento pluvial', 'lluvias torrenciales', 'aniego', 'palo de agua', 'calle hecha río', 'barrio bajo anegado', 'agua que se mete a las casas', 'agua al tope', 'lluvia que no para', 'agua desbordada', 'río salido', 'agua que tapa todo', 'lluvia brava']
  },
  {
    id: 'fenomeno_incendio',
    question: 'Incendio',
    answer: 'Un incendio es un fuego no controlado que puede propagarse rápidamente.\n👉 Recomendación: Evacúa, llama a los bomberos y no intentes apagarlo si es grande.',
    category: 'Fenómenos Naturales',
    keywords: ['incendio', 'fuego', 'incendio forestal', 'quema de maleza', 'fuego de montaña', 'fuego de bosque', 'incendio de pastizal', 'conflagración forestal', 'quema', 'fuego en el monte', 'candela en el cerro', 'fuego bravo', 'incendio de monte', 'monte ardiendo', 'fuego descontrolado', 'candela brava', 'fuego que avanza']
  },
  {
    id: 'fenomeno_huracan',
    question: 'Huracán',
    answer: 'Un huracán es una tormenta tropical con fuertes vientos y lluvias intensas.\n👉 Recomendación: Refúgiate en un lugar seguro, asegura ventanas y ten a mano tu kit de emergencia.',
    category: 'Fenómenos Naturales',
    keywords: ['huracán', 'ciclón', 'ciclón tropical', 'tormenta ciclónica', 'tormenta tropical intensa', 'tormenta de gran escala', 'sistema tropical', 'depresión tropical', 'temporal grande', 'temporalón', 'tormentón', 'viento huracanado', 'viento bravo', 'tormenta que arrasa', 'tormenta del mar', 'viento de mar fuerte', 'lluvia con viento fuerte', 'vendaval']
  },
  {
    id: 'fenomeno_tormenta',
    question: 'Tormenta eléctrica',
    answer: 'Una tormenta eléctrica es un fenómeno de lluvia con rayos y truenos.\n👉 Recomendación: Permanece bajo techo, evita usar aparatos eléctricos y no te acerques a árboles altos.',
    category: 'Fenómenos Naturales',
    keywords: ['tormenta', 'eléctrica', 'rayos', 'truenos', 'tormenta eléctrica', 'tormenta con rayos', 'descarga eléctrica atmosférica', 'tormenta de truenos', 'tormenta de relámpagos', 'actividad eléctrica en nubes', 'lluvia con trueno', 'lluvia con relámpagos', 'tronadera', 'relampagueo', 'trueno bravo', 'lluvia que truena', 'rayos por todos lados', 'relámpagos fuertes', 'trueno que sacude', 'trueno con lluvia']
  },
  {
    id: 'fenomeno_deslave_simple',
    question: 'Deslave',
    answer: 'Un deslave es el desprendimiento de tierra en una pendiente.\n👉 Recomendación: Aléjate de laderas, pendientes y zonas con grietas en el suelo.',
    category: 'Fenómenos Naturales',
    keywords: ['deslave']
  },
  {
    id: 'fenomeno_derrumbe_simple',
    question: 'Derrumbe',
    answer: 'Un derrumbe es la caída repentina de tierra o rocas.\n👉 Recomendación: Evacúa inmediatamente y busca terreno plano y seguro.',
    category: 'Fenómenos Naturales',
    keywords: ['derrumbe']
  },
  {
    id: 'fenomeno_apagon',
    question: 'Apagón o corte de energía',
    answer: 'Un apagón es la interrupción del suministro eléctrico.\n👉 Recomendación: Usa linternas, desconecta aparatos y mantén la calma.',
    category: 'Fenómenos Naturales',
    keywords: ['apagón', 'corte', 'energía', 'electricidad']
  },
  {
    id: 'fenomeno_vientos',
    question: 'Vientos fuertes',
    answer: 'Son corrientes de aire de alta velocidad que pueden causar daños.\n👉 Recomendación: Cierra puertas y ventanas, asegura objetos sueltos y permanece en un lugar seguro.',
    category: 'Fenómenos Naturales',
    keywords: ['vientos', 'fuertes', 'tornado', 'embudo de aire', 'tromba terrestre', 'ciclón local', 'vórtice de viento', 'torbellino atmosférico', 'remolino gigante', 'aire que da vuelta', 'viento que da vueltas', 'torbellino', 'cola de nube', 'viento loco', 'soplón de aire', 'tromba', 'remolino bravo', 'viento de remolino', 'viento fuerte', 'ráfagas de viento', 'viento huracanado', 'ventarrón', 'polvareda', 'soplón de polvo', 'viento que levanta tierra', 'viento bravo', 'viento seco']
  },

  // Categoría 13: Preguntas extras para enriquecer el chatbot
  {
    id: 'vehiculo_sismo',
    question: '¿Qué hacer si estoy en un vehículo durante un sismo?',
    answer: 'Detener el vehículo en un lugar abierto, lejos de postes o puentes, y permanecer dentro hasta que termine.',
    category: 'Emergencias Especiales',
    keywords: ['vehículo', 'auto', 'carro', 'sismo', 'detener', 'lugar', 'abierto', 'postes', 'puentes']
  },
  {
    id: 'informacion_falsa',
    question: '¿Cómo identificar información falsa durante una emergencia?',
    answer: 'Revisar medios oficiales como SINAPRED, INETER o Cruz Blanca antes de compartir cualquier dato.',
    category: 'Emergencias Especiales',
    keywords: ['información', 'falsa', 'emergencia', 'medios', 'oficiales', 'sinapred', 'ineter', 'cruz', 'blanca']
  },
  {
    id: 'alerta_roja',
    question: '¿Qué es la alerta roja?',
    answer: 'Es el máximo nivel de emergencia que indica peligro inminente y la necesidad de evacuar o tomar precauciones extremas.',
    category: 'Emergencias Especiales',
    keywords: ['alerta', 'roja', 'máximo', 'nivel', 'emergencia', 'peligro', 'inminente', 'evacuar', 'precauciones']
  },
  {
    id: 'olor_gas',
    question: '¿Qué hacer si hay olor a gas después de un desastre?',
    answer: 'Evitar encender fuego o aparatos eléctricos, salir del lugar y reportar a las autoridades.',
    category: 'Emergencias Especiales',
    keywords: ['olor', 'gas', 'después', 'desastre', 'evitar', 'fuego', 'eléctricos', 'salir', 'reportar', 'autoridades']
  },
  {
    id: 'discapacidad_evacuacion',
    question: '¿Cómo proteger a personas con discapacidad durante una evacuación?',
    answer: 'Tener un plan previo, equipo de asistencia y rutas accesibles.',
    category: 'Emergencias Especiales',
    keywords: ['proteger', 'personas', 'discapacidad', 'evacuación', 'plan', 'previo', 'equipo', 'asistencia', 'rutas', 'accesibles']
  },

  // Categoría 14: Respuestas educativas para términos coloquiales
  {
    id: 'palo_de_agua_educativo',
    question: 'Palo de agua',
    answer: 'Excelente, "palo de agua" es una expresión nicaragüense para lluvias muy intensas que pueden causar inundaciones. El término técnico es "lluvias torrenciales". 🌧️\n👉 Durante un palo de agua: Evita salir, mantente en lugares altos y no cruces calles inundadas.',
    category: 'Educación Lingüística',
    keywords: ['palo de agua', 'lluvia muy fuerte', 'lluvia intensa']
  },
  {
    id: 'volcan_bravo_educativo',
    question: 'Volcán bravo',
    answer: 'Perfectamente, "volcán bravo" es como decimos en Nicaragua cuando un volcán muestra actividad volcánica intensa. 🌋\n👉 Si el volcán está bravo: Usa mascarilla N95, cierra ventanas y sigue las instrucciones de evacuación.',
    category: 'Educación Lingüística',
    keywords: ['volcán bravo', 'volcán activo', 'volcán despierto']
  },
  {
    id: 'temporal_grande_educativo',
    question: 'Temporal grande',
    answer: 'Así es, "temporal grande" o "temporalón" es nuestra forma de llamar a los huracanes o tormentas tropicales intensas. 🌀\n👉 Durante un temporal: Refúgiate en un lugar seguro, asegura ventanas y ten tu kit de emergencia listo.',
    category: 'Educación Lingüística',
    keywords: ['temporal grande', 'temporalón', 'tormentón']
  },
  {
    id: 'temblorazo_educativo',
    question: 'Temblorazo',
    answer: 'Exacto, "temblorazo" es como llamamos cariñosamente a un terremoto o sismo fuerte en Nicaragua. 🌍\n👉 Durante un temblorazo: Protégete bajo muebles fuertes, cúbrete la cabeza y mantén la calma.',
    category: 'Educación Lingüística',
    keywords: ['temblorazo', 'estremón', 'sacudión']
  },
  {
    id: 'tronadera_educativo',
    question: 'Tronadera',
    answer: 'Sí, "tronadera" es nuestra palabra para las tormentas eléctricas con muchos truenos y relámpagos. ⚡\n👉 Durante una tronadera: Permanece bajo techo, desconecta aparatos y evita árboles altos.',
    category: 'Educación Lingüística',
    keywords: ['tronadera', 'relampagueo', 'trueno bravo']
  }
]

// Preguntas sugeridas organizadas por categorías
const suggestedQuestions = {
  'Emergencias': [
    '¿Qué hacer en caso de sismo?',
    '¿Números de emergencia Nicaragua?',
    '¿Cómo actuar en erupción volcánica?',
    '¿Qué es la alerta roja?'
  ],
  'Preparación': [
    '¿Cómo armar kit de emergencia?',
    '¿Qué incluir en botiquín?',
    '¿Cuánta agua almacenar?',
    '¿Cómo prevenir deslaves en zonas de riesgo?'
  ],
  'Fenómenos': [
    '¿Qué gases emite el volcán?',
    '¿Cuándo ocurren inundaciones?',
    '¿Señales de deslaves?',
    '¿Qué es un deslave?',
    '¿Qué es un derrumbe?'
  ],
  'Aplicación': [
    '¿Cómo usar Guardian Nica?',
    '¿Cómo reportar eventos?',
    '¿Cómo funciona el mapa?'
  ]
}

export function Chatbox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      type: 'bot',
      content: '¡Hola! 🐜 Soy el asistente de Guardian Nica. Puedo ayudarte con preguntas sobre desastres naturales, preparación de emergencias y cómo usar la aplicación. ¿En qué puedo ayudarte?',
      timestamp: new Date(),
      category: 'Bienvenida'
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showCategories, setShowCategories] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Función mejorada para encontrar respuestas con mejor comprensión del contexto
  const findBestMatch = (userInput: string): { match: FAQItem | null, confidence: number, suggestions: FAQItem[] } => {
    const input = userInput.toLowerCase().trim()
    const words = input.split(' ').filter(word => word.length > 2)
    
    let bestMatch: FAQItem | null = null
    let bestScore = 0
    const scoredResults: { faq: FAQItem, score: number }[] = []

    faqDatabase.forEach(faq => {
      let score = 0
      
      // Coincidencias exactas en la pregunta (alta puntuación)
      if (faq.question.toLowerCase().includes(input)) {
        score += 15
      }
      
      // Palabras clave coincidentes (puntuación media-alta)
      words.forEach(word => {
        if (faq.keywords.some(keyword => 
          keyword.toLowerCase().includes(word) || 
          word.includes(keyword.toLowerCase())
        )) {
          score += 3
        }
        if (faq.question.toLowerCase().includes(word)) {
          score += 2
        }
        if (faq.answer.toLowerCase().includes(word)) {
          score += 1
        }
      })

      // Términos relacionados específicos (mejora la comprensión contextual)
      const contextBoosts = {
        'emergencia': ['emergencia', 'urgente', 'ayuda', 'rápido', 'inmediato'],
        'números': ['telefono', 'numero', 'contacto', 'llamar', 'comunicar'],
        'preparación': ['preparar', 'kit', 'lista', 'antes', 'prevenir'],
        'durante': ['que hacer', 'como actuar', 'durante', 'en caso'],
        'después': ['después', 'post', 'limpiar', 'recuperar']
      }

      // Vocabulario coloquial nicaragüense con alta puntuación
      const nicaraguanTerms = {
        'volcán': ['volcán bravo', 'volcán botando humo', 'volcán tirando fuego', 'volcán echando vapor', 'volcán despierto', 'volcán rugiendo'],
        'lluvia': ['palo de agua', 'lluvia brava', 'lluvia que no para'],
        'inundación': ['calle hecha río', 'agua que se mete', 'agua al tope', 'agua desbordada', 'río salido'],
        'huracán': ['temporal grande', 'temporalón', 'tormentón', 'viento bravo', 'vendaval'],
        'tormenta': ['tronadera', 'relampagueo', 'trueno bravo', 'lluvia que truena'],
        'terremoto': ['temblorazo', 'estremón', 'sacudión', 'tierra temblando', 'la tierra se movió'],
        'tornado': ['remolino bravo', 'aire que da vuelta', 'viento loco', 'torbellino'],
        'deslizamiento': ['tierra que se viene abajo', 'cerro que se viene', 'bajada de lodo', 'barranco que se cayó'],
        'incendio': ['fuego bravo', 'candela brava', 'fuego en el monte', 'monte ardiendo']
      }

      // Aplicar boost especial para términos coloquiales nicaragüenses
      Object.entries(nicaraguanTerms).forEach(([formal, colloquial]) => {
        colloquial.forEach(term => {
          if (input.includes(term.toLowerCase())) {
            if (faq.keywords.some(k => k.toLowerCase().includes(formal)) || 
                faq.answer.toLowerCase().includes(formal) ||
                faq.question.toLowerCase().includes(formal)) {
              score += 8 // Alta puntuación para términos coloquiales
            }
          }
        })
      })

      Object.entries(contextBoosts).forEach(([context, relatedTerms]) => {
        if (relatedTerms.some(term => input.includes(term))) {
          if (faq.answer.toLowerCase().includes(context) || 
              faq.keywords.some(k => k.includes(context))) {
            score += 2
          }
        }
      })

      if (score > 0) {
        scoredResults.push({ faq, score })
      }

      if (score > bestScore) {
        bestScore = score
        bestMatch = faq
      }
    })

    // Ordenar resultados por puntuación y obtener sugerencias
    const suggestions = scoredResults
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.faq)
      .filter(faq => faq !== bestMatch)

    const confidence = bestScore > 5 ? 'high' : bestScore > 2 ? 'medium' : 'low'
    
    return { 
      match: bestMatch, 
      confidence: bestScore, 
      suggestions: suggestions.slice(0, 2) 
    }
  }

  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim()
    if (!messageText) return

    // Agregar mensaje del usuario
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simular tiempo de respuesta del bot con lógica mejorada
    setTimeout(() => {
      const { match, confidence, suggestions } = findBestMatch(messageText)
      
      let botResponse: string
      let category: string

      if (match && confidence > 3) {
        // Respuesta directa con alta confianza
        botResponse = `${match.answer}\n\n✅ ¿Te fue útil esta información? \n\n💡 **Tip**: Puedes preguntarme cosas como:\n• "¿Cómo preparo mi casa para sismos?"\n• "¿Qué medicinas incluir en el kit?"\n• "¿Números de bomberos?"\n\n🐜 ¡Estoy aquí para ayudarte!`
        category = match.category
      } else if (match && confidence > 1) {
        // Respuesta con sugerencias adicionales
        let suggestionText = ""
        if (suggestions.length > 0) {
          suggestionText = `\n\n🤔 **¿Quizás buscabas?**\n${suggestions.map((s, i) => `${i + 1}. ${s.question}`).join('\n')}\n\nPuedes preguntar sobre cualquiera de estos temas.`
        }
        
        botResponse = `${match.answer}${suggestionText}\n\n🐜 ¿Es esto lo que necesitabas saber?`
        category = match.category
      } else {
        // Búsqueda por categorías cuando no hay coincidencia directa
        const categoryMatches = faqDatabase.filter(faq => {
          const input = messageText.toLowerCase()
          return faq.category.toLowerCase().includes(input) ||
                 input.includes(faq.category.toLowerCase().split(' ')[0].toLowerCase())
        })

        if (categoryMatches.length > 0) {
          const randomMatch = categoryMatches[0]
          botResponse = `No encontré una respuesta exacta, pero aquí tienes información sobre **${randomMatch.category}**:\n\n${randomMatch.answer}\n\n📚 **Otras preguntas frecuentes sobre ${randomMatch.category}:**\n${categoryMatches.slice(1, 3).map((faq, i) => `• ${faq.question}`).join('\n')}\n\n🐜 ¡Pregúntame cualquiera de estas!`
          category = randomMatch.category
        } else {
          // Respuesta por defecto mejorada
          botResponse = `🤔 No encontré una respuesta específica, pero puedo ayudarte con:\n\n🆘 **Emergencias:**\n• ¿Qué hacer en caso de sismo?\n• ¿Números de emergencia Nicaragua?\n• ¿Cómo actuar en erupción volcánica?\n\n🎒 **Preparación:**\n• ¿Cómo armar kit de emergencia?\n• ¿Qué incluir en botiquín?\n• ¿Cómo preparar la casa?\n\n📱 **Guardian Nica:**\n• ¿Cómo reportar eventos?\n• ¿Cómo usar el mapa?\n• ¿Qué alertas recibo?\n\n🐜 ¡Escribe tu pregunta de forma más específica y te ayudo mejor!`
          category = 'Ayuda General'
        }
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: botResponse,
        timestamp: new Date(),
        category
      }

      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
    }, 800 + Math.random() * 1200)
  }

  const handleSuggestedQuestion = (question: string) => {
    setShowCategories(false)
    setSelectedCategory(null)
    handleSendMessage(question)
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setShowCategories(false)
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setShowCategories(true)
  }

  const handleNewQuestion = () => {
    setSelectedCategory(null)
    setShowCategories(true)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <>
      {/* Botón flotante */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
            size="lg"
          >
            <div className="flex items-center justify-center">
              <span className="text-2xl group-hover:scale-110 transition-transform duration-200">🐜</span>
            </div>
          </Button>
        )}
      </div>

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[650px] max-h-[85vh]">
          <Card className="h-full shadow-2xl border-2 border-blue-200">
            {/* Header */}
            <CardHeader className="bg-blue-600 text-white rounded-t-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🐜</span>
                  <div>
                    <CardTitle className="text-lg text-white">Guardian Nica</CardTitle>
                    <p className="text-sm text-blue-100">Asistente de Emergencias</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-blue-700 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            {/* Área de mensajes */}
            <CardContent className="flex flex-col h-full p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{message.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.category && message.type === 'bot' && (
                            <Badge variant="outline" className="text-xs">
                              {message.category}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Indicador de escribiendo */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Navegación de categorías y preguntas */}
              {messages.length <= 2 && (
                <div className="p-4 border-t bg-gray-50 max-h-48 overflow-y-auto">
                  {showCategories && !selectedCategory && (
                    <div>
                      <p className="text-xs text-gray-600 mb-3 flex items-center gap-1">
                        <Search className="h-3 w-3" />
                        Selecciona un tema de ayuda:
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(suggestedQuestions).map((category) => (
                          <Button
                            key={category}
                            variant="outline"
                            size="sm"
                            onClick={() => handleCategorySelect(category)}
                            className="text-xs h-auto py-2 px-3 justify-start"
                          >
                            <div className="flex items-center gap-2">
                              {category === 'Emergencias' && <Phone className="h-3 w-3" />}
                              {category === 'Preparación' && <Lightbulb className="h-3 w-3" />}
                              {category === 'Fenómenos' && <AlertTriangle className="h-3 w-3" />}
                              {category === 'Aplicación' && <MapPin className="h-3 w-3" />}
                              {category}
                            </div>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCategory && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs text-gray-600 font-medium">{selectedCategory}:</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleBackToCategories}
                          className="text-xs h-auto p-1"
                        >
                          ← Volver
                        </Button>
                      </div>
                      <div className="space-y-1">
                        {suggestedQuestions[selectedCategory as keyof typeof suggestedQuestions]?.map((question, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestedQuestion(question)}
                            className="w-full text-xs h-auto py-2 px-3 text-left justify-start whitespace-normal leading-relaxed"
                          >
                            {question}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Botón para nueva pregunta cuando hay conversación */}
              {messages.length > 2 && (
                <div className="p-3 border-t bg-gray-50">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNewQuestion}
                    className="w-full text-xs gap-2"
                  >
                    <Search className="h-3 w-3" />
                    Explorar más temas
                  </Button>
                </div>
              )}

              {/* Input area */}
              <div className="p-4 border-t">
                <p className="text-xs text-gray-500 mb-3">
                  💡 Pregunta sobre sismos, volcanes, inundaciones, kits de emergencia...
                </p>
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Escribe tu pregunta..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    onClick={() => handleSendMessage()}
                    disabled={!inputValue.trim() || isTyping}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
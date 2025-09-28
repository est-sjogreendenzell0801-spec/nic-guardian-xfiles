import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { ImageWithFallback } from './figma/ImageWithFallback'
import { AlertTriangle, Shield, Eye, Phone } from 'lucide-react'

interface ThreatInfo {
  id: string
  name: string
  description: string
  image: string
  riskLevel: 'low' | 'medium' | 'high' | 'extreme'
  signs: string[]
  preventionMeasures: string[]
  emergencyActions: string[]
}

const threats: ThreatInfo[] = [
  {
    id: 'volcano',
    name: 'Volcanes 🌋',
    description: 'Las erupciones pueden lanzar ceniza, gases y lava, afectando la salud, viviendas y cultivos.',
    image: 'https://images.unsplash.com/photo-1628591808593-117d46c6cc7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2b2xjYW5vJTIwZXJ1cHRpb24lMjBsYXZhfGVufDF8fHx8MTc1ODU5MzU0Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    riskLevel: 'high',
    signs: [
      'Temblores frecuentes o fuertes',
      'Salida de gases, vapor o humo',
      'Grietas o levantamientos en el suelo',
      'Caída de ceniza en comunidades cercanas'
    ],
    preventionMeasures: [
      'Conozca si su barrio está en zona de riesgo',
      'Guarde mascarillas y gafas protectoras',
      'Tenga lista una ruta de evacuación',
      'Escuche los reportes oficiales de INETER'
    ],
    emergencyActions: [
      'Evacúe si las autoridades lo indican',
      'Use mascarilla y cubra ojos y nariz',
      'Evite conducir durante caída de ceniza'
    ]
  },
  {
    id: 'tornado',
    name: 'Tornados 🌪️',
    description: 'Columnas de aire giratorio que pueden destruir techos, árboles y vehículos.',
    image: 'https://images.unsplash.com/photo-1648440841386-ef74020fe7ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9ybSUyMHdlYXRoZXIlMjB0b3JuYWRvfGVufDF8fHx8MTc1NzY0NDIxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    riskLevel: 'extreme',
    signs: [
      'Nube en forma de embudo bajando del cielo',
      'Granizo grande o lluvia intensa repentina',
      'Ruido fuerte como tren en movimiento',
      'Vientos giratorios visibles'
    ],
    preventionMeasures: [
      'Manténgase informado del clima',
      'Identifique una habitación segura sin ventanas',
      'Prepare un kit de emergencia',
      'Practique simulacros familiares'
    ],
    emergencyActions: [
      'Refúgiese en sótano o habitación interior',
      'Aléjese de ventanas y puertas',
      'Protéjase bajo una mesa resistente'
    ]
  },
  {
    id: 'hurricane',
    name: 'Huracanes 🌀',
    description: 'Traen vientos muy fuertes, lluvias torrenciales y subida del nivel del mar.',
    image: 'https://images.unsplash.com/flagged/photo-1574848488709-65d899054a02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxodXJyaWNhbmUlMjBzYXRlbGxpdGUlMjB2aWV3fGVufDF8fHx8MTc1NzY0NDIxNHww&ixlib=rb-4.1.0&q=80&w=1080',
    riskLevel: 'extreme',
    signs: [
      'Vientos crecientes y sostenidos',
      'Lluvias continuas e intensas',
      'Subida del nivel de agua en zonas costeras',
      'Cielo muy oscuro con nubes densas'
    ],
    preventionMeasures: [
      'Refuerce puertas y ventanas',
      'Guarde agua y alimentos para 3 días',
      'Tenga combustible y baterías a mano',
      'Conozca rutas de evacuación'
    ],
    emergencyActions: [
      'Evacúe si SINAPRED lo ordena',
      'Permanezca bajo techo lejos de ventanas',
      'No salga durante el ojo del huracán'
    ]
  },
  {
    id: 'flood',
    name: 'Inundaciones 🌊',
    description: 'Las lluvias intensas pueden cubrir calles y casas, sobre todo en zonas bajas o cerca de ríos.',
    image: 'https://images.unsplash.com/photo-1717480981075-359e1d348ae1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmbG9vZCUyMGVtZXJnZW5jeSUyMHdhdGVyfGVufDF8fHx8MTc1NzY0NDIxNXww&ixlib=rb-4.1.0&q=80&w=1080',
    riskLevel: 'high',
    signs: [
      'Lluvia fuerte y prolongada',
      'Agua turbia o con escombros en calles',
      'Sonido fuerte de agua corriendo',
      'Animales huyendo de áreas bajas'
    ],
    preventionMeasures: [
      'Sepa si su casa está en zona inundable',
      'Eleve documentos y objetos importantes',
      'Limpie canales y drenajes',
      'Tenga lista una ruta de evacuación'
    ],
    emergencyActions: [
      'Muévase a terreno alto de inmediato',
      'No camine ni conduzca en agua en movimiento'
    ]
  },
  {
    id: 'lightning',
    name: 'Tormentas Eléctricas ⚡',
    description: 'Producen rayos y vientos que pueden ser mortales.',
    image: 'https://images.unsplash.com/photo-1533722616720-dbe64a9cda4c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaWdodG5pbmclMjBzdG9ybSUyMGVsZWN0cmljfGVufDF8fHx8MTc1ODU5MzU0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    riskLevel: 'medium',
    signs: [
      'Nubes oscuras y cargadas',
      'Truenos cada vez más cercanos',
      'Vientos fuertes y repentinos',
      'Sensación de electricidad en el aire'
    ],
    preventionMeasures: [
      'Evite actividades al aire libre',
      'Desconecte aparatos eléctricos',
      'Instale pararrayos si es posible',
      'Siga reportes del clima'
    ],
    emergencyActions: [
      'Refúgiese en edificio cerrado',
      'Aléjese de árboles y postes',
      'No use teléfonos con cable ni toque metales'
    ]
  },
  {
    id: 'wildfire',
    name: 'Incendios Forestales 🔥',
    description: 'En época seca, el fuego puede propagarse rápido y afectar viviendas y bosques.',
    image: 'https://images.unsplash.com/photo-1634009653379-a97409ee15de?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aWxkZmlyZSUyMGZvcmVzdCUyMGZpcmV8ZW58MXx8fHwxNzU3NTc0MTQ4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    riskLevel: 'high',
    signs: [
      'Humo espeso y persistente',
      'Olor fuerte a quemado',
      'Ceniza cayendo del cielo',
      'Animales huyendo del área'
    ],
    preventionMeasures: [
      'No queme basura en temporada seca',
      'Mantenga limpio el terreno alrededor de su casa',
      'Tenga extintores o agua lista',
      'Participe en brigadas comunitarias'
    ],
    emergencyActions: [
      'Evacúe si el fuego se aproxima',
      'Cierre puertas y ventanas',
      'Use mascarilla para evitar inhalar humo'
    ]
  },
  {
    id: 'landslides',
    name: 'Deslaves 🏔️',
    description: 'Movimientos de tierra, rocas y vegetación que bajan por pendientes, especialmente peligrosos durante lluvias intensas.',
    image: 'https://images.unsplash.com/photo-1707582678851-ebb6e0e50163?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2xpZGUlMjBlcm9zaW9uJTIwc29pbHxlbnwxfHx8fDE3NTg4MDUzNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    riskLevel: 'high',
    signs: [
      'Grietas nuevas en el suelo o paredes',
      'Árboles o postes inclinándose',
      'Agua turbia en manantiales',
      'Sonidos de rocas cayendo o tierra moviéndose',
      'Aparición de manantiales donde no había'
    ],
    preventionMeasures: [
      'No construir en laderas empinadas',
      'Plantar vegetación que estabilice el suelo',
      'Mantener limpios los drenajes',
      'Evitar excavaciones cerca de pendientes',
      'Conocer zonas de riesgo en su comunidad'
    ],
    emergencyActions: [
      'Evacuar inmediatamente hacia zonas altas',
      'Alejarse de la trayectoria del deslizamiento',
      'No correr cuesta abajo',
      'Evitar ríos que puedan represarse'
    ]
  },
  {
    id: 'rockfall',
    name: 'Derrumbes 🪨',
    description: 'Caída súbita de rocas y material sólido desde acantilados o paredes rocosas, provocada por sismos, lluvia o erosión.',
    image: 'https://images.unsplash.com/photo-1663785011920-0675b85819cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb2NrZmFsbCUyMGNsaWZmJTIwZGVicmlzfGVufDF8fHx8MTc1ODgwNTM4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    riskLevel: 'medium',
    signs: [
      'Grietas en paredes rocosas',
      'Pequeñas piedras cayendo frecuentemente',
      'Sonidos de cracking en rocas',
      'Cambios en la forma del terreno',
      'Actividad sísmica reciente'
    ],
    preventionMeasures: [
      'No construir directamente bajo acantilados',
      'Inspeccionar regularmente paredes rocosas',
      'Instalar mallas de protección si es necesario',
      'Evitar excavaciones que debiliten bases rocosas',
      'Seguir indicaciones en zonas de riesgo'
    ],
    emergencyActions: [
      'Alejarse inmediatamente de la zona',
      'Buscar refugio bajo estructuras sólidas',
      'No caminar bajo acantilados tras sismos',
      'Reportar desprendimientos a autoridades'
    ]
  }
]

const riskColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  extreme: 'bg-red-100 text-red-800'
}

const riskLabels = {
  low: 'Riesgo Bajo 🟢',
  medium: 'Riesgo Medio 🟡',
  high: 'Riesgo Alto 🟠',
  extreme: 'Riesgo Extremo 🔴'
}

export function EducationalContent() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2>Guía de Amenazas Meteorológicas</h2>
        <p className="text-muted-foreground mt-2">
          Aprende a identificar, prevenir y actuar ante diferentes amenazas climáticas
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {threats.map((threat) => (
          <Card key={threat.id} className="overflow-hidden">
            <div className="relative h-48">
              <ImageWithFallback
                src={threat.image}
                alt={threat.name}
                className="w-full h-full object-cover"
              />
              <Badge 
                className={`absolute top-3 right-3 ${riskColors[threat.riskLevel]}`}
              >
                {riskLabels[threat.riskLevel]}
              </Badge>
            </div>
            
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                {threat.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {threat.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  <h4 className="font-medium">Señales de Alerta</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  {threat.signs.map((sign, index) => (
                    <li key={index} className="list-disc">{sign}</li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4 text-green-500" />
                  <h4 className="font-medium">Medidas Preventivas</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  {threat.preventionMeasures.map((measure, index) => (
                    <li key={index} className="list-disc">{measure}</li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-4 w-4 text-red-500" />
                  <h4 className="font-medium">Acciones de Emergencia</h4>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-6">
                  {threat.emergencyActions.map((action, index) => (
                    <li key={index} className="list-disc">{action}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="w-full">
              <h3 className="font-medium text-blue-900 mb-3">Números de Emergencia Nicaragua</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">Emergencias Principales</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div className="flex justify-between">
                      <span>Policía Nacional:</span>
                      <span className="font-medium">118</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bomberos:</span>
                      <span className="font-medium">115</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ambulancias:</span>
                      <span className="font-medium">102</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cruz Blanca:</span>
                      <span className="font-medium">128</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-blue-800">Autoridades Especializadas</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <div className="flex justify-between">
                      <span>SINAPRED:</span>
                      <span className="font-medium">100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Defensa Civil:</span>
                      <span className="font-medium">2228-9915</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ENACAL:</span>
                      <span className="font-medium">127</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
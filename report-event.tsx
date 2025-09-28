import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { MapPin, Camera, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface WeatherReport {
  id: string
  type: string
  severity: string
  location: string
  coordinates: [number, number] | null
  description: string
  timestamp: Date
  reporter: string
  status: 'pending' | 'verified' | 'false'
}

const eventTypes = [
  { value: 'volcano', label: 'Volcán / Erupción', icon: '🌋' },
  { value: 'storm', label: 'Tormenta eléctrica / Lluvia fuerte', icon: '⚡' },
  { value: 'flood', label: 'Inundación / Agua alta', icon: '🌊' },
  { value: 'wind', label: 'Viento fuerte / Tornado', icon: '🌪️' },
  { value: 'fire', label: 'Incendio / Fuego', icon: '🔥' },
  { value: 'earthquake', label: 'Temblor / Sismo', icon: '🌍' },
  { value: 'hurricane', label: 'Huracán / Ciclón', icon: '🌀' },
  { value: 'landslide', label: 'Deslizamiento de tierra / Lodo', icon: '🌱' }
]

const severityLevels = [
  { value: 'low', label: 'Bajo', color: '#FFFF00' },
  { value: 'medium', label: 'Medio', color: '#FFA500' },
  { value: 'high', label: 'Alto', color: '#FF0000' },
  { value: 'extreme', label: 'Extremo', color: '#8B0000' }
]

// Componente para mostrar nivel de riesgo
const RiskLevel = ({ severity }: { severity: string }) => {
  const level = severityLevels.find(s => s.value === severity)
  if (!level) return null
  
  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-3 h-3 rounded-full border border-gray-300"
        style={{ backgroundColor: level.color }}
      />
      <span className="text-sm font-medium text-gray-900">{level.label}</span>
    </div>
  )
}

// Componente para el estado del reporte
const ReportStatus = ({ status }: { status: string }) => {
  const statuses = {
    pending: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800', icon: null },
    verified: { label: 'Verificado', className: 'bg-green-100 text-green-800', icon: CheckCircle },
    false: { label: 'Falso', className: 'bg-red-100 text-red-800', icon: null }
  }
  
  const currentStatus = statuses[status as keyof typeof statuses] || statuses.pending
  const IconComponent = currentStatus.icon
  
  return (
    <Badge className={`${currentStatus.className} text-xs px-2 py-1`}>
      {IconComponent && <IconComponent className="h-3 w-3 mr-1" />}
      {currentStatus.label}
    </Badge>
  )
}

// Mock data para reportes existentes
const mockReports: WeatherReport[] = [
  {
    id: '1',
    type: 'volcano',
    severity: 'extreme',
    location: 'Volcán Masaya',
    coordinates: [11.9842, -86.1689],
    description: 'Actividad volcánica incrementada con emisión de gases y cenizas. Se observa incremento en la temperatura del cráter y pequeñas explosiones.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    reporter: 'Observador Local',
    status: 'verified'
  },
  {
    id: '2',
    type: 'storm',
    severity: 'high',
    location: 'Managua Centro',
    coordinates: [12.1364, -86.2514],
    description: 'Tormenta eléctrica intensa con lluvia fuerte y rayos frecuentes. Vientos de aproximadamente 60 km/h.',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    reporter: 'Usuario Anónimo',
    status: 'verified'
  },
  {
    id: '3',
    type: 'earthquake',
    severity: 'medium',
    location: 'León',
    coordinates: [12.4334, -86.8780],
    description: 'Temblor de magnitud moderada sentido en toda la ciudad. Duración aproximada de 15 segundos.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    reporter: 'Usuario Anónimo',
    status: 'verified'
  },
  {
    id: '4',
    type: 'landslide',
    severity: 'high',
    location: 'Las Sabanas',
    coordinates: [12.8500, -85.9167],
    description: 'Deslizamiento de tierra debido a lluvias intensas, carretera principal bloqueada. Varias familias evacuadas.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    reporter: 'Autoridades Locales',
    status: 'verified'
  }
]

export function ReportEvent() {
  const [reports, setReports] = useState<WeatherReport[]>(mockReports)
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    type: '',
    severity: '',
    location: '',
    description: '',
    reporter: ''
  })
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude])
          setFormData(prev => ({
            ...prev,
            location: `Lat: ${position.coords.latitude.toFixed(4)}, Lng: ${position.coords.longitude.toFixed(4)}`
          }))
          toast('Ubicación obtenida exitosamente')
        },
        () => {
          toast('No se pudo obtener la ubicación')
        }
      )
    } else {
      toast('Geolocalización no disponible')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío del reporte
    setTimeout(() => {
      const newReport: WeatherReport = {
        id: Date.now().toString(),
        type: formData.type,
        severity: formData.severity,
        location: formData.location,
        coordinates: userLocation,
        description: formData.description,
        timestamp: new Date(),
        reporter: formData.reporter || 'Usuario Anónimo',
        status: 'pending'
      }

      setReports(prev => [newReport, ...prev])
      setFormData({
        type: '', 
        severity: '', 
        location: '', 
        description: '', 
        reporter: ''
      })
      setUserLocation(null)
      setIsSubmitting(false)
      setIsOpen(false)
      
      toast('Reporte enviado exitosamente. Será verificado por nuestro equipo.')
    }, 2000)
  }

  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `hace ${hours} hora${hours > 1 ? 's' : ''}`
    }
    return `hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`
  }

  return (
    <div className="space-y-6">
      {/* Header con botón principal mejorado */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reportes de Eventos</h2>
          <p className="text-base text-gray-600 mt-1">
            Comparte información sobre eventos meteorológicos en tu zona
          </p>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 gap-2"
            >
              <Camera className="h-5 w-5" />
              Reportar Evento
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Reportar Evento Meteorológico</SheetTitle>
              <SheetDescription>
                Ayuda a la comunidad reportando eventos meteorológicos en tu zona
              </SheetDescription>
            </SheetHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <div>
                <Label htmlFor="type">Tipo de Evento</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de evento" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="severity">Nivel de Severidad</Label>
                <Select value={formData.severity} onValueChange={(value) => setFormData(prev => ({ ...prev, severity: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la severidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full border border-gray-300"
                            style={{ backgroundColor: level.color }}
                          />
                          <span>{level.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Ubicación</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Describe la ubicación"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={getCurrentLocation}>
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe lo que observaste en detalle..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="reporter">Tu Nombre (Opcional)</Label>
                <Input
                  id="reporter"
                  value={formData.reporter}
                  onChange={(e) => setFormData(prev => ({ ...prev, reporter: e.target.value }))}
                  placeholder="Deja en blanco para ser anónimo"
                />
              </div>

              <Alert>
                <AlertDescription>
                  Tu reporte será verificado por nuestro equipo antes de ser mostrado a otros usuarios.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={isSubmitting || !formData.type || !formData.description} className="flex-1">
                  {isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      {/* Lista de reportes con diseño mejorado */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Reportes Recientes</h3>
        {reports.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">No hay reportes disponibles</p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="space-y-3">
                {/* Header del reporte con jerarquía clara */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {eventTypes.find(t => t.value === report.type)?.icon}
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {eventTypes.find(t => t.value === report.type)?.label || report.type}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-medium text-gray-700">Sistema</span>
                        <ReportStatus status={report.status} />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <RiskLevel severity={report.severity} />
                  </div>
                </div>

                {/* Descripción del evento */}
                <p className="text-sm text-gray-700 leading-relaxed pl-11">
                  {report.description}
                </p>

                {/* Metadatos del reporte */}
                <div className="flex items-center gap-6 text-xs text-gray-500 pl-11 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(report.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span>{report.location}</span>
                  </div>
                  <div>
                    <span>Por: {report.reporter}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
import React, { useState, useEffect } from 'react';
import { 
  Bell, Menu, X, MapPin, TrendingUp, AlertTriangle, 
  Download, Leaf, Droplets, Bug, Thermometer,
  BarChart3, Map, Settings, Home, Search, User,
  ChevronDown, Activity, Calendar, Sun,
  Filter, MoreVertical, Zap, Shield, Target
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';


const mockTemporalData = [
  { date: 'Jan', ndvi: 0.65, moisture: 72, temperature: 18, nutrients: 85, yield: 2.1 },
  { date: 'Feb', ndvi: 0.72, moisture: 68, temperature: 22, nutrients: 82, yield: 2.3 },
  { date: 'Mar', ndvi: 0.78, moisture: 75, temperature: 25, nutrients: 88, yield: 2.8 },
  { date: 'Apr', ndvi: 0.82, moisture: 71, temperature: 28, nutrients: 90, yield: 3.2 },
  { date: 'May', ndvi: 0.79, moisture: 65, temperature: 31, nutrients: 87, yield: 3.0 },
  { date: 'Jun', ndvi: 0.85, moisture: 70, temperature: 29, nutrients: 92, yield: 3.5 }
];

const mockAlerts = [
  { id: 1, type: 'critical', message: 'Severe drought detected in Field A-3', time: '2 min ago', severity: 'high', location: 'Field A-3' },
  { id: 2, type: 'warning', message: 'Pest risk elevated in Section B-2', time: '15 min ago', severity: 'medium', location: 'Section B-2' },
  { id: 3, type: 'info', message: 'Irrigation cycle completed successfully', time: '1 hour ago', severity: 'low', location: 'All Fields' },
  { id: 4, type: 'warning', message: 'Soil moisture below optimal threshold', time: '2 hours ago', severity: 'medium', location: 'Field C-1' }
];

const mockSoilData = [
  { id: 1, location: 'Field A-1', ph: 6.8, moisture: 72, nitrogen: 85, phosphorus: 78, potassium: 92, health: 'excellent' },
  { id: 2, location: 'Field A-2', ph: 7.2, moisture: 68, nitrogen: 82, phosphorus: 85, potassium: 88, health: 'good' },
  { id: 3, location: 'Field B-1', ph: 6.5, moisture: 75, nitrogen: 90, phosphorus: 72, potassium: 85, health: 'good' },
  { id: 4, location: 'Field B-2', ph: 7.0, moisture: 71, nitrogen: 88, phosphorus: 80, potassium: 90, health: 'excellent' },
  { id: 5, location: 'Field C-1', ph: 6.2, moisture: 45, nitrogen: 65, phosphorus: 68, potassium: 72, health: 'poor' },
  { id: 6, location: 'Field C-2', ph: 6.9, moisture: 78, nitrogen: 87, phosphorus: 83, potassium: 89, health: 'excellent' }
];

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [notifications, setNotifications] = useState(mockAlerts);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const getAlertIcon = (type: string): React.ReactNode => {
    switch(type) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default: return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const getSeverityStyles = (severity: string): string => {
    switch(severity) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-amber-50 border-amber-200 text-amber-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getHealthColor = (health: string): string => {
    switch(health) {
      case 'excellent': return 'text-emerald-700';
      case 'good': return 'text-green-700';
      case 'fair': return 'text-yellow-700';
      default: return 'text-red-700';
    }
  };

  const downloadReport = (format: string): void => {
    alert(`${format.toUpperCase()} Report Generated - This would trigger an actual download in a real implementation`);
  };

  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ name: string; value: number | string; color?: string }>;
    label?: string;
  }

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-xl shadow-xl border border-gray-200">
          <p className="text-sm font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm font-medium" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const SpectralHealthMap = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <div className="p-3 bg-emerald-100 rounded-xl mr-4">
            <Map className="w-6 h-6 text-emerald-700" />
          </div>
          Real-Time Spectral Health Analysis
        </h3>
        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      <div className="relative h-96 bg-gradient-to-br from-emerald-25 via-green-25 to-blue-25 rounded-2xl overflow-hidden border border-gray-100">
        <div className="absolute inset-0 p-6">
          <div className="grid grid-cols-6 gap-3 h-full">
            {[...Array(24)].map((_, i) => {
              const health = Math.random();
              const getColor = () => {
                if (health > 0.8) return 'bg-emerald-500 shadow-emerald-200';
                if (health > 0.6) return 'bg-green-500 shadow-green-200';
                if (health > 0.4) return 'bg-yellow-500 shadow-yellow-200';
                return 'bg-red-500 shadow-red-200';
              };
              
              return (
                <div 
                  key={i} 
                  className={`${getColor()} rounded-xl opacity-90 hover:opacity-100 flex items-center justify-center text-white text-sm font-bold cursor-pointer transition-all duration-200 hover:scale-105 shadow-lg`}
                >
                  {(health * 100).toFixed(0)}%
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">NDVI Health Index</div>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-emerald-500 rounded-full mr-3 shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Excellent (80-100%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3 shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Good (60-80%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3 shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Fair (40-60%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3 shadow-sm"></div>
              <span className="text-sm font-medium text-gray-700">Poor (0-40%)</span>
            </div>
          </div>
        </div>

        <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-blue-600 rounded-full animate-pulse shadow-lg border-2 border-white"></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-blue-600 rounded-full animate-pulse shadow-lg border-2 border-white"></div>
        <div className="absolute bottom-1/3 left-2/4 w-4 h-4 bg-blue-600 rounded-full animate-pulse shadow-lg border-2 border-white"></div>
      </div>
    </div>
  );

  const TemporalTrends = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <div className="p-3 bg-blue-100 rounded-xl mr-4">
            <TrendingUp className="w-6 h-6 text-blue-700" />
          </div>
          Temporal Trend Analysis
        </h3>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
            6 Months
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            1 Year
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Vegetation Health & Moisture Levels</h4>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={mockTemporalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="ndvi" 
                stroke="#059669" 
                strokeWidth={3} 
                dot={{ fill: '#059669', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, strokeWidth: 0, fill: '#059669' }}
                name="NDVI"
              />
              <Line 
                type="monotone" 
                dataKey="moisture" 
                stroke="#0284c7" 
                strokeWidth={3} 
                dot={{ fill: '#0284c7', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, strokeWidth: 0, fill: '#0284c7' }}
                name="Moisture %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-800">Environmental Conditions</h4>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mockTemporalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="temperature" 
                stackId="1" 
                stroke="#d97706" 
                fill="rgba(217, 119, 6, 0.2)"
                name="Temperature °C"
              />
              <Area 
                type="monotone" 
                dataKey="nutrients" 
                stackId="2" 
                stroke="#7c3aed" 
                fill="rgba(124, 58, 237, 0.2)"
                name="Nutrients %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const AnomalyAlerts = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <div className="p-3 bg-red-100 rounded-xl mr-4">
            <AlertTriangle className="w-6 h-6 text-red-700" />
          </div>
          Active Field Alerts
        </h3>
        <span className="px-4 py-2 bg-red-100 text-red-700 text-sm font-bold rounded-full">
          {notifications.length} Active
        </span>
      </div>
      
      <div className="space-y-4">
        {notifications.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-6 rounded-xl border-l-4 ${getSeverityStyles(alert.severity)} transition-all duration-200 hover:shadow-md group cursor-pointer`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                {getAlertIcon(alert.type)}
                <div className="flex-1">
                  <p className="text-sm font-bold mb-2">{alert.message}</p>
                  <div className="flex items-center text-xs font-medium opacity-80 space-x-4">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {alert.location}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {alert.time}
                    </span>
                  </div>
                </div>
              </div>
              <button className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 rounded transition-all duration-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        <button className="w-full p-4 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors duration-200 border border-blue-200 hover:border-blue-300">
          View All Alert History
        </button>
      </div>
    </div>
  );

  const SoilConditions = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <div className="p-3 bg-green-100 rounded-xl mr-4">
            <Leaf className="w-6 h-6 text-green-700" />
          </div>
          Comprehensive Soil Health Analysis
        </h3>
        <button className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300">
          <Filter className="w-4 h-4" />
          <span>Filter Fields</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockSoilData.map((field) => (
          <div 
            key={field.id} 
            className="group p-6 border border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-gray-25 to-white"
          >
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-bold text-gray-900">{field.location}</h4>
              <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                field.health === 'excellent' ? 'bg-emerald-100 text-emerald-800' :
                field.health === 'good' ? 'bg-green-100 text-green-800' :
                field.health === 'fair' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {field.health}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  pH Level
                </span>
                <span className="font-bold text-gray-900">{field.ph}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 flex items-center">
                  <div className="w-3 h-3 bg-cyan-500 rounded-full mr-3"></div>
                  Moisture Content
                </span>
                <span className="font-bold text-gray-900">{field.moisture}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  Nitrogen
                </span>
                <span className="font-bold text-gray-900">{field.nitrogen}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700 flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  Phosphorus
                </span>
                <span className="font-bold text-gray-900">{field.phosphorus}%</span>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 flex items-center">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
                    Potassium
                  </span>
                  <span className={`font-bold ${getHealthColor(field.health)} flex items-center`}>
                    {field.potassium}% 
                    {field.health === 'excellent' && <Zap className="w-4 h-4 ml-1" />}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const RiskZones = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center">
          <div className="p-3 bg-purple-100 rounded-xl mr-4">
            <Target className="w-6 h-6 text-purple-700" />
          </div>
          AI-Powered Risk Assessment
        </h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center text-sm font-semibold text-gray-700">
            <Shield className="w-4 h-4 mr-2 text-green-600" />
            AI Confidence: 94%
          </div>
        </div>
      </div>
      
      <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl overflow-hidden border border-gray-200">
        <div className="absolute inset-0 p-6">
          <div className="grid grid-cols-8 gap-2 h-full">
            {[...Array(48)].map((_, i) => {
              const risk = Math.random();
              const getColorAndOpacity = () => {
                if (risk > 0.7) return { color: 'bg-red-500', opacity: 0.9 };
                if (risk > 0.4) return { color: 'bg-yellow-500', opacity: 0.8 };
                return { color: 'bg-green-500', opacity: 0.7 };
              };
              
              const { color, opacity } = getColorAndOpacity();
              
              return (
                <div 
                  key={i} 
                  className={`${color} rounded-lg hover:scale-110 transition-transform duration-200 cursor-pointer shadow-sm`} 
                  style={{ opacity }}
                  title={`Risk Level: ${(risk * 100).toFixed(0)}%`}
                ></div>
              );
            })}
          </div>
        </div>
        
        <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <div className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Risk Distribution</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-3 shadow-sm"></div>
                <span className="text-sm font-semibold text-gray-700">High Risk</span>
              </div>
              <span className="text-sm font-bold text-gray-900">12 zones</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3 shadow-sm"></div>
                <span className="text-sm font-semibold text-gray-700">Medium Risk</span>
              </div>
              <span className="text-sm font-bold text-gray-900">18 zones</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mr-3 shadow-sm"></div>
                <span className="text-sm font-semibold text-gray-700">Low Risk</span>
              </div>
              <span className="text-sm font-bold text-gray-900">18 zones</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-6 left-6 flex space-x-3">
          <div className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-full animate-pulse shadow-lg">
            Live Monitoring Active
          </div>
        </div>
      </div>
    </div>
  );

  const StatsCards = () => {
    const stats = [
      { 
        label: 'Total Agricultural Fields', 
        value: '24', 
        change: '+2', 
        changeType: 'positive',
        icon: MapPin, 
        color: 'text-blue-700',
        bgColor: 'bg-blue-100'
      },
      { 
        label: 'Average NDVI Score', 
        value: '0.78', 
        change: '+0.05', 
        changeType: 'positive',
        icon: Leaf, 
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-100'
      },
      { 
        label: 'Active Alert Systems', 
        value: '4', 
        change: '-2', 
        changeType: 'positive',
        icon: AlertTriangle, 
        color: 'text-red-700',
        bgColor: 'bg-red-100'
      },
      { 
        label: 'Soil Health Index', 
        value: '87%', 
        change: '+3%', 
        changeType: 'positive',
        icon: Activity, 
        color: 'text-purple-700',
        bgColor: 'bg-purple-100'
      }
    ];

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="group bg-white rounded-2xl shadow-sm border border-gray-200 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mb-3">{stat.value}</p>
                <div className="flex items-center">
                  <span className={`text-sm font-bold ${
                    stat.changeType === 'positive' ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-xs font-medium text-gray-500 ml-2">vs last week</span>
                </div>
              </div>
              <div className={`p-4 rounded-2xl ${stat.bgColor} ${stat.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                <stat.icon className="w-8 h-8" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-50 flex transition-colors duration-300">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-white shadow-xl border-r border-gray-200 flex flex-col`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  AgriMonitor 
                </h1>
              </div>
            )}
            <button 
              onClick={toggleSidebar} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'overview', label: 'Dashboard Overview', icon: Home },
            { id: 'maps', label: 'Field Mapping', icon: Map },
            { id: 'analytics', label: 'Advanced Analytics', icon: BarChart3 },
            { id: 'alerts', label: 'Alert Management', icon: Bell },
            { id: 'reports', label: 'Export Reports', icon: Download },
            { id: 'settings', label: 'System Settings', icon: Settings }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                activeSection === item.id 
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg transform scale-105' 
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeSection === item.id ? 'text-white' : 'group-hover:scale-110'} transition-transform duration-200`} />
              {sidebarOpen && <span className="font-semibold">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 px-4 py-3 text-gray-600 rounded-xl">
            <Sun className="w-5 h-5" />
            {sidebarOpen && (
              <span className="font-semibold text-sm">
                Light Mode Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-6 transition-colors duration-300 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Smart Agriculture Dashboard</h2>
              <p className="text-base text-gray-600 mt-2 font-medium">AI-powered precision agriculture monitoring and analytics platform</p>
            </div>
            
            <div className="flex items-center space-x-6">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search fields, alerts, analytics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 w-80 bg-gray-100 border-0 rounded-2xl text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 font-medium"
                />
              </div>

              {/* Export Button */}
              <div className="relative group">
                <button className="flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-2xl hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold">
                  <Download className="w-5 h-5" />
                  <span className="hidden sm:inline">Export Data</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-200 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  <button 
                    onClick={() => downloadReport('pdf')}
                    className="block w-full text-left px-6 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-t-2xl transition-colors"
                  >
                    📄 Comprehensive PDF Report
                  </button>
                  <button 
                    onClick={() => downloadReport('excel')}
                    className="block w-full text-left px-6 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-b-2xl transition-colors"
                  >
                    📊 Excel Analytics Report
                  </button>
                </div>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-2xl transition-all duration-200"
                >
                  <Bell className="w-6 h-6" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-bold">
                      {notifications.length}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-20 transform opacity-0 scale-95 animate-in">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="font-bold text-gray-900 text-lg">Recent Field Alerts</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.slice(0, 3).map((alert) => (
                        <div key={alert.id} className="p-6 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start space-x-4">
                            {getAlertIcon(alert.type)}
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900 mb-1">{alert.message}</p>
                              <p className="text-xs text-gray-600 font-medium">{alert.time} • {alert.location}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-4 p-3 hover:bg-gray-100 rounded-2xl transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-gray-900">John Farmer</p>
                    <p className="text-xs text-gray-600 font-medium">Senior Farm Manager</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 overflow-y-auto bg-gray-50 transition-colors duration-300 min-h-0">
          <StatsCards />
          
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
            <div className="xl:col-span-2">
              <SpectralHealthMap />
            </div>
            <div>
              <AnomalyAlerts />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            <TemporalTrends />
            <RiskZones />
          </div>

          <SoilConditions />
        </main>
      </div>
    </div>
  );
};

export default App;
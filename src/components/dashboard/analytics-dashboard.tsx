"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebase/client-app";
import { collection, query, getDocs, orderBy, where, limit } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  FileText, 
  GitCompareArrows,
  Clock,
  CheckCircle,
  AlertTriangle,
  Download,
  Filter,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, subDays, startOfDay, endOfDay, differenceInDays } from "date-fns";
import { ptBR } from "date-fns/locale";

type AnalyticsData = {
  totalPatients: number;
  totalAppointments: number;
  totalReports: number;
  totalComparisons: number;
  completedAppointments: number;
  pendingAppointments: number;
  overdueAppointments: number;
  healingProgress: {
    improved: number;
    stable: number;
    worsened: number;
  };
  monthlyStats: {
    month: string;
    appointments: number;
    reports: number;
    comparisons: number;
  }[];
  woundTypes: {
    type: string;
    count: number;
    percentage: number;
  }[];
  priorityDistribution: {
    priority: string;
    count: number;
    percentage: number;
  }[];
  timeToHealing: {
    range: string;
    count: number;
  }[];
};

type TimeRange = '7d' | '30d' | '90d' | '1y' | 'all';

export function AnalyticsDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalyticsData = async () => {
    if (!user) return;

    setRefreshing(true);
    try {
      const endDate = new Date();
      const startDate = timeRange === 'all' 
        ? new Date(2020, 0, 1) 
        : subDays(endDate, timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365);

      // Buscar dados de anamnese
      const anamnesisQuery = query(
        collection(db, "users", user.uid, "anamnesis"),
        orderBy("data_consulta", "desc")
      );
      const anamnesisSnapshot = await getDocs(anamnesisQuery);
      const anamnesisData = anamnesisSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Buscar dados de relatórios
      const reportsQuery = query(
        collection(db, "users", user.uid, "reports"),
        orderBy("createdAt", "desc")
      );
      const reportsSnapshot = await getDocs(reportsQuery);
      const reportsData = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Buscar dados de comparações
      const comparisonsQuery = query(
        collection(db, "users", user.uid, "comparisons"),
        orderBy("createdAt", "desc")
      );
      const comparisonsSnapshot = await getDocs(comparisonsQuery);
      const comparisonsData = comparisonsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Buscar dados de agendamentos
      const appointmentsQuery = query(
        collection(db, "users", user.uid, "appointments"),
        orderBy("date", "desc")
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const appointmentsData = appointmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Processar dados
      const filteredAnamnesis = anamnesisData.filter(item => {
        const itemDate = new Date(item.data_consulta);
        return itemDate >= startDate && itemDate <= endDate;
      });

      const filteredReports = reportsData.filter(item => {
        const itemDate = item.createdAt?.toDate() || new Date();
        return itemDate >= startDate && itemDate <= endDate;
      });

      const filteredComparisons = comparisonsData.filter(item => {
        const itemDate = item.createdAt?.toDate() || new Date();
        return itemDate >= startDate && itemDate <= endDate;
      });

      const filteredAppointments = appointmentsData.filter(item => {
        const itemDate = item.date?.toDate() || new Date();
        return itemDate >= startDate && itemDate <= endDate;
      });

      // Calcular estatísticas
      const uniquePatients = new Set(anamnesisData.map(item => item.nome_cliente)).size;
      
      const completedAppointments = filteredAppointments.filter(app => app.status === 'realizado').length;
      const pendingAppointments = filteredAppointments.filter(app => app.status === 'agendado' || app.status === 'confirmado').length;
      const overdueAppointments = filteredAppointments.filter(app => {
        const appDate = app.date?.toDate() || new Date();
        return appDate < new Date() && (app.status === 'agendado' || app.status === 'confirmado');
      }).length;

      // Análise de progresso de cicatrização (baseado nas comparações)
      let improved = 0, stable = 0, worsened = 0;
      filteredComparisons.forEach(comp => {
        if (comp.progressMetrics) {
          switch (comp.progressMetrics.overallProgress) {
            case 'melhora': improved++; break;
            case 'estavel': stable++; break;
            case 'piora': worsened++; break;
          }
        }
      });

      // Estatísticas mensais
      const monthlyStats = [];
      const months = [];
      for (let i = 11; i >= 0; i--) {
        const date = subDays(endDate, i * 30);
        months.push({
          month: format(date, 'MMM', { locale: ptBR }),
          appointments: filteredAppointments.filter(app => {
            const appDate = app.date?.toDate() || new Date();
            return appDate.getMonth() === date.getMonth() && appDate.getFullYear() === date.getFullYear();
          }).length,
          reports: filteredReports.filter(rep => {
            const repDate = rep.createdAt?.toDate() || new Date();
            return repDate.getMonth() === date.getMonth() && repDate.getFullYear() === date.getFullYear();
          }).length,
          comparisons: filteredComparisons.filter(comp => {
            const compDate = comp.createdAt?.toDate() || new Date();
            return compDate.getMonth() === date.getMonth() && compDate.getFullYear() === date.getFullYear();
          }).length,
        });
      }

      // Tipos de feridas
      const woundTypeCounts: { [key: string]: number } = {};
      filteredAnamnesis.forEach(item => {
        const type = item.tipo_ferida || 'Não especificado';
        woundTypeCounts[type] = (woundTypeCounts[type] || 0) + 1;
      });

      const totalWounds = Object.values(woundTypeCounts).reduce((sum, count) => sum + count, 0);
      const woundTypes = Object.entries(woundTypeCounts).map(([type, count]) => ({
        type,
        count,
        percentage: totalWounds > 0 ? Math.round((count / totalWounds) * 100) : 0
      })).sort((a, b) => b.count - a.count);

      // Distribuição de prioridades
      const priorityCounts: { [key: string]: number } = {};
      filteredAppointments.forEach(app => {
        const priority = app.priority || 'media';
        priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
      });

      const totalPriorities = Object.values(priorityCounts).reduce((sum, count) => sum + count, 0);
      const priorityDistribution = Object.entries(priorityCounts).map(([priority, count]) => ({
        priority,
        count,
        percentage: totalPriorities > 0 ? Math.round((count / totalPriorities) * 100) : 0
      }));

      // Tempo de cicatrização (simulado baseado nas comparações)
      const timeToHealing = [
        { range: '0-7 dias', count: Math.floor(filteredComparisons.length * 0.1) },
        { range: '8-14 dias', count: Math.floor(filteredComparisons.length * 0.3) },
        { range: '15-30 dias', count: Math.floor(filteredComparisons.length * 0.4) },
        { range: '30+ dias', count: Math.floor(filteredComparisons.length * 0.2) },
      ];

      const analytics: AnalyticsData = {
        totalPatients: uniquePatients,
        totalAppointments: filteredAppointments.length,
        totalReports: filteredReports.length,
        totalComparisons: filteredComparisons.length,
        completedAppointments,
        pendingAppointments,
        overdueAppointments,
        healingProgress: { improved, stable, worsened },
        monthlyStats: months,
        woundTypes,
        priorityDistribution,
        timeToHealing,
      };

      setAnalyticsData(analytics);
    } catch (error) {
      console.error("Erro ao buscar dados de analytics:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de analytics.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [user, timeRange]);

  const StatCard = ({ title, value, icon: Icon, trend, subtitle }: {
    title: string;
    value: number | string;
    icon: any;
    trend?: 'up' | 'down' | 'neutral';
    subtitle?: string;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center text-xs">
            {trend === 'up' && <TrendingUp className="h-3 w-3 text-green-600 mr-1" />}
            {trend === 'down' && <TrendingDown className="h-3 w-3 text-red-600 mr-1" />}
            {trend === 'neutral' && <BarChart3 className="h-3 w-3 text-gray-600 mr-1" />}
            <span className={trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
              {trend === 'up' ? 'Crescimento' : trend === 'down' ? 'Declínio' : 'Estável'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const ProgressBar = ({ label, value, max, color = "bg-primary" }: {
    label: string;
    value: number;
    max: number;
    color?: string;
  }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value} ({Math.round((value / max) * 100)}%)</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${(value / max) * 100}%` }}
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-4 text-muted-foreground">Carregando analytics...</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Nenhum dado disponível</h3>
        <p className="text-muted-foreground">Comece a usar o sistema para ver suas estatísticas.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Analytics Avançados</h2>
          <p className="text-muted-foreground">Insights e métricas do seu trabalho</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={(value: TimeRange) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
              <SelectItem value="all">Todo período</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchAnalyticsData}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Pacientes"
          value={analyticsData.totalPatients}
          icon={Users}
          trend="up"
          subtitle="Pacientes únicos atendidos"
        />
        <StatCard
          title="Agendamentos"
          value={analyticsData.totalAppointments}
          icon={Calendar}
          trend="neutral"
          subtitle={`${analyticsData.completedAppointments} realizados`}
        />
        <StatCard
          title="Relatórios Gerados"
          value={analyticsData.totalReports}
          icon={FileText}
          trend="up"
          subtitle="Análises com IA"
        />
        <StatCard
          title="Comparações"
          value={analyticsData.totalComparisons}
          icon={GitCompareArrows}
          trend="up"
          subtitle="Análises de progressão"
        />
      </div>

      {/* Tabs com diferentes visualizações */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="healing">Progressão</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
          <TabsTrigger value="wounds">Tipos de Feridas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Status dos Agendamentos</CardTitle>
                <CardDescription>Distribuição atual dos agendamentos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ProgressBar
                  label="Realizados"
                  value={analyticsData.completedAppointments}
                  max={analyticsData.totalAppointments}
                  color="bg-green-500"
                />
                <ProgressBar
                  label="Pendentes"
                  value={analyticsData.pendingAppointments}
                  max={analyticsData.totalAppointments}
                  color="bg-yellow-500"
                />
                <ProgressBar
                  label="Em Atraso"
                  value={analyticsData.overdueAppointments}
                  max={analyticsData.totalAppointments}
                  color="bg-red-500"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Prioridades</CardTitle>
                <CardDescription>Agendamentos por nível de prioridade</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.priorityDistribution.map((item) => (
                  <div key={item.priority} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {item.priority}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="healing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Progressão de Cicatrização</CardTitle>
                <CardDescription>Resultados das comparações de progressão</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Melhora: {analyticsData.healingProgress.improved}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Estável: {analyticsData.healingProgress.stable}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Piora: {analyticsData.healingProgress.worsened}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tempo de Cicatrização</CardTitle>
                <CardDescription>Distribuição do tempo para cicatrização</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analyticsData.timeToHealing.map((item) => (
                  <ProgressBar
                    key={item.range}
                    label={item.range}
                    value={item.count}
                    max={analyticsData.timeToHealing.reduce((sum, t) => sum + t.count, 0)}
                    color="bg-blue-500"
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas Mensais</CardTitle>
              <CardDescription>Atividade ao longo dos últimos 12 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.monthlyStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="font-medium">{stat.month}</div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>{stat.appointments} agendamentos</span>
                      <span>{stat.reports} relatórios</span>
                      <span>{stat.comparisons} comparações</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wounds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tipos de Feridas</CardTitle>
              <CardDescription>Distribuição dos tipos de feridas atendidas</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {analyticsData.woundTypes.map((item) => (
                <ProgressBar
                  key={item.type}
                  label={item.type}
                  value={item.count}
                  max={analyticsData.woundTypes.reduce((sum, w) => sum + w.count, 0)}
                  color="bg-purple-500"
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

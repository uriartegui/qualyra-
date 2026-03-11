import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getRegressions } from '../../api/regressions'
import { getTopics } from '../../api/topics'
import { getTemplates } from '../../api/templates'
import useAuthStore from '../../store/authStore'
import { PlayCircle, FileText, BookOpen, CheckCircle, XCircle, Clock } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({ regressions: 0, templates: 0, topics: 0 })
  const [recentRegressions, setRecentRegressions] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const [reg, tmpl, top] = await Promise.all([
          getRegressions({ size: 5 }),
          getTemplates({ size: 1 }),
          getTopics({ size: 1 }),
        ])
        setStats({
          regressions: reg.data.totalElements,
          templates: tmpl.data.totalElements,
          topics: top.data.totalElements,
        })
        setRecentRegressions(reg.data.content)
      } catch {}
    }
    load()
  }, [])

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Olá, {user?.name}! 👋</h1>
        <p className="text-gray-500 mt-1">Aqui está o resumo da sua organização.</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {[
          { label: 'Regressões', value: stats.regressions, icon: PlayCircle, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Templates', value: stats.templates, icon: FileText, color: 'text-blue-600 bg-blue-50' },
          { label: 'Tópicos', value: stats.topics, icon: BookOpen, color: 'text-purple-600 bg-purple-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color} mb-4`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-500 text-sm">{label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Regressões recentes</h2>
          <Link to="/regressions" className="text-indigo-600 text-sm hover:underline">Ver todas</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recentRegressions.length === 0 ? (
            <p className="p-6 text-gray-400 text-sm">Nenhuma regressão ainda.</p>
          ) : (
            recentRegressions.map(reg => (
              <Link key={reg.id} to={`/regressions/${reg.id}`}
                className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{reg.name}</p>
                  <p className="text-xs text-gray-400">{reg.templateName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-3 text-xs">
                    <span className="flex items-center gap-1 text-green-600"><CheckCircle size={12} />{reg.passed}</span>
                    <span className="flex items-center gap-1 text-red-500"><XCircle size={12} />{reg.failed}</span>
                    <span className="flex items-center gap-1 text-gray-400"><Clock size={12} />{reg.pending}</span>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    reg.status === 'COMPLETED' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'
                  }`}>
                    {reg.status === 'COMPLETED' ? 'Concluída' : 'Em progresso'}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

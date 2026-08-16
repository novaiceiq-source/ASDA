content = open('src/App.tsx').read()
target = "              ) : reportsView === 'shifts' ? ("
replacement = """              ) : reportsView === 'delegates_settings' ? (
                <div className="space-y-6 pb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setReportsView('menu')}
                        className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 rotate-180" />
                      </button>
                      <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Users className="w-6 h-6 text-purple-500" />
                        إدارة المندوبين
                      </h2>
                    </div>
                    <button 
                      onClick={() => setDelegateModal({ isOpen: true, id: '', name: '', whatsapp: '' })}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      إضافة مندوب
                    </button>
                  </div>
                  
                  {delegates.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                      لا يوجد مندوبين حالياً
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {delegates.map((del) => (
                        <div key={del.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 flex justify-between items-center">
                          <div>
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg mb-1">{del.name}</h3>
                            <a href={`https://wa.me/${del.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 transition-colors">
                              <Phone className="w-4 h-4" />
                              <span dir="ltr">{del.whatsapp}</span>
                            </a>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setDelegateModal({ isOpen: true, id: del.id, name: del.name, whatsapp: del.whatsapp })}
                              className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-blue-50 hover:text-blue-500 transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteDelegate(del.id)}
                              className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : reportsView === 'shifts' ? ("""

content = content.replace(target, replacement)
open('src/App.tsx', 'w').write(content)

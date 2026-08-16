import re

content = open('src/App.tsx').read()

# 1. Add state variable
state_target = "const [statsDelegateId, setStatsDelegateId] = useState<string | null>(null);"
state_replacement = "const [statsDelegateId, setStatsDelegateId] = useState<string | null>(null);\n  const [mainDelegateId, setMainDelegateId] = useState<string | null>(null);"
if state_target in content:
    content = content.replace(state_target, state_replacement)

# 2. Update delegates view
delegates_view_target = """        {activeTab === 'delegates' && (
            <motion.div
              key="delegates"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 px-2 flex items-center gap-2 transition-colors duration-300">
                  <Users className="w-5 h-5 text-blue-500" />
                  قائمة المندوبين
                </h2>
                
                {delegates.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300">
                    لا يوجد مندوبين حالياً
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {delegates.map((del, idx) => (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        key={del.id} 
                        className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08),_inset_0_2px_4px_rgba(255,255,255,0.8),_inset_0_-2px_6px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3),_inset_0_1px_3px_rgba(255,255,255,0.05),_inset_0_-2px_6px_rgba(0,0,0,0.2)] border border-slate-100/60 dark:border-slate-800 relative overflow-hidden flex flex-col gap-4"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 rounded-bl-full -z-10 transition-colors duration-300"></div>
                        
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">{del.name}</h3>
                            <a href={`https://wa.me/${del.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 transition-colors">
                              <Phone className="w-4 h-4" />
                              <span dir="ltr">{del.whatsapp}</span>
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}"""

delegates_view_replacement = """        {activeTab === 'delegates' && (
            <motion.div
              key="delegates"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 pb-20"
            >
              {!mainDelegateId ? (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-slate-700 dark:text-slate-300 px-2 flex items-center gap-2 transition-colors duration-300">
                    <Users className="w-5 h-5 text-blue-500" />
                    قائمة المندوبين
                  </h2>
                  
                  {delegates.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium transition-colors duration-300">
                      لا يوجد مندوبين حالياً
                    </div>
                  ) : (
                    <div className="grid gap-4">
                      {delegates.map((del, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          key={del.id}
                          onClick={() => setMainDelegateId(del.id)}
                          className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08),_inset_0_2px_4px_rgba(255,255,255,0.8),_inset_0_-2px_6px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3),_inset_0_1px_3px_rgba(255,255,255,0.05),_inset_0_-2px_6px_rgba(0,0,0,0.2)] border border-slate-100/60 dark:border-slate-800 relative overflow-hidden flex flex-col gap-4 cursor-pointer active:scale-[0.98] transition-transform"
                        >
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-50 to-transparent dark:from-blue-900/20 rounded-bl-full -z-10 transition-colors duration-300"></div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/40 dark:to-cyan-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-inner">
                                <Users className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 transition-colors duration-300">{del.name}</h3>
                                <a href={`https://wa.me/${del.whatsapp}`} onClick={(e) => e.stopPropagation()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm font-semibold text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 transition-colors">
                                  <Phone className="w-4 h-4" />
                                  <span dir="ltr">{del.whatsapp}</span>
                                </a>
                              </div>
                            </div>
                            <ChevronLeft className="w-5 h-5 text-slate-400 dark:text-slate-600" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  {(() => {
                    const delegate = delegates.find(d => d.id === mainDelegateId);
                    if (!delegate) return null;

                    const now = new Date();
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    
                    const dailyInvoices = invoices.filter(inv => 
                      inv.delegateId === delegate.id && 
                      new Date(inv.date).getTime() >= startOfDay
                    );

                    return (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <button 
                            onClick={() => setMainDelegateId(null)}
                            className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                          >
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                          </button>
                          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-indigo-500" />
                            مبيعات {delegate.name} اليوم
                          </h2>
                        </div>

                        {/* Recent Invoices List */}
                        <div>
                          {dailyInvoices.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-500 shadow-sm border border-slate-100 dark:border-slate-800">
                              لا توجد عمليات بيع مسجلة اليوم لهذا المندوب
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {dailyInvoices.slice().reverse().map((inv) => (
                                <div key={inv.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                                  <div className="flex justify-between items-center mb-3">
                                    <div>
                                      <div className="text-sm font-semibold text-slate-500">{new Date(inv.date).toLocaleString('ar-IQ', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                                      <div className="font-bold text-slate-800 dark:text-slate-100 text-xs mt-0.5">{inv.id}</div>
                                    </div>
                                    <div className="text-left">
                                      <div className="font-black text-indigo-600 dark:text-indigo-400 text-lg">{inv.totalAmount.toLocaleString()} د.ع</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
                                    <div className="text-sm font-bold text-slate-500">{inv.items.reduce((s, i) => s + i.quantity, 0)} قطع مباعة</div>
                                    <button 
                                      onClick={() => setDraftInvoice(JSON.parse(JSON.stringify(inv)))}
                                      className="flex items-center gap-1.5 text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors active:scale-95"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                      تعديل الفاتورة
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </motion.div>
          )}"""

if delegates_view_target in content:
    content = content.replace(delegates_view_target, delegates_view_replacement)
else:
    print("Could not find delegates view target")

open('src/App.tsx', 'w').write(content)
print("Updated successfully")

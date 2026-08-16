import re

content = open('src/App.tsx').read()

# 1. Update delegates tab (activeTab === 'delegates')
# Remove the viewedDelegateId logic and the button.
# Replace from `          {activeTab === 'delegates' && (` down to its closing `          )}`

target_delegates_tab = """          {activeTab === 'delegates' && (
            <motion.div
              key="delegates"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >

              <div className="space-y-4">
                {viewedDelegateId ? (
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <button 
                        onClick={() => setViewedDelegateId(null)}
                        className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 rotate-180" />
                      </button>
                      <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Users className="w-6 h-6 text-blue-500" />
                        فواتير {delegates.find(d => d.id === viewedDelegateId)?.name}
                      </h2>
                    </div>
                    <div className="space-y-4">
                      {invoices.filter(inv => inv.delegateId === viewedDelegateId).length === 0 ? (
                        <p className="text-center py-8 text-slate-400 dark:text-slate-500 font-medium">لا توجد فواتير مسجلة</p>
                      ) : (
                        invoices.filter(inv => inv.delegateId === viewedDelegateId).map(invoice => (
                          <div key={invoice.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                              <div>
                                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{invoice.id}</div>
                                <div className="text-xs text-slate-500">{new Date(invoice.date).toLocaleString('ar-IQ')}</div>
                              </div>
                              <button 
                                onClick={() => setInvoiceReceipt(invoice)}
                                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-lg text-sm active:scale-95"
                              >
                                عرض
                              </button>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-600 dark:text-slate-400">إجمالي السلع: {invoice.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                              <span className="font-bold text-emerald-500">{invoice.totalAmount.toLocaleString()} د.ع</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ) : (
                  <>
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

                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                              <button 
                                onClick={() => setViewedDelegateId(del.id)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                عرض الفواتير والمبيعات
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          )}"""

replacement_delegates_tab = """          {activeTab === 'delegates' && (
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

content = content.replace(target_delegates_tab, replacement_delegates_tab)

# 2. Update delegates_settings
# Replace the old `reportsView === 'delegates_settings'` to include the viewedDelegateId logic

target_delegates_settings = """              ) : reportsView === 'delegates_settings' ? (
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
                        <div key={del.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
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
              ) : reportsView === 'delegates_settings' ? ("""

replacement_delegates_settings = """              ) : reportsView === 'delegates_settings' ? (
                <div className="space-y-6 pb-6">
                  {viewedDelegateId ? (
                    <div>
                      <div className="flex items-center gap-3 mb-6">
                        <button 
                          onClick={() => setViewedDelegateId(null)}
                          className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                        >
                          <ChevronLeft className="w-5 h-5 rotate-180" />
                        </button>
                        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                          <ShoppingCart className="w-6 h-6 text-blue-500" />
                          فواتير {delegates.find(d => d.id === viewedDelegateId)?.name}
                        </h2>
                      </div>
                      <div className="space-y-4">
                        {invoices.filter(inv => inv.delegateId === viewedDelegateId).length === 0 ? (
                          <p className="text-center py-8 text-slate-400 dark:text-slate-500 font-medium bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">لا توجد فواتير مسجلة</p>
                        ) : (
                          invoices.filter(inv => inv.delegateId === viewedDelegateId).map(invoice => (
                            <div key={invoice.id} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-200 dark:border-slate-800">
                              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{invoice.id}</div>
                                  <div className="text-xs text-slate-500">{new Date(invoice.date).toLocaleString('ar-IQ')}</div>
                                </div>
                                <button 
                                  onClick={() => setInvoiceReceipt(invoice)}
                                  className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold rounded-lg text-sm active:scale-95 transition-all"
                                >
                                  عرض
                                </button>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600 dark:text-slate-400">إجمالي السلع: {invoice.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                                <span className="font-bold text-emerald-500">{invoice.totalAmount.toLocaleString()} د.ع</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ) : (
                    <>
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
                            <div key={del.id} className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col gap-4">
                              <div className="flex justify-between items-center">
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
                                    className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-blue-50 hover:text-blue-500 transition-colors active:scale-95"
                                  >
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteDelegate(del.id)}
                                    className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors active:scale-95"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button 
                                  onClick={() => setViewedDelegateId(del.id)}
                                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-bold text-sm active:scale-95 transition-all"
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                  عرض الفواتير والمبيعات
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ) : reportsView === 'delegates_settings' ? ("""

# wait, there's a duplication in the original code? 
# " ) : reportsView === 'delegates_settings' ? (" is present twice. Let's make sure our replacement is exact.

open('update_logic.py', 'w').write(f'''
import sys

content = open("src/App.tsx").read()

if {repr(target_delegates_tab)} not in content:
    print("Could not find delegates tab target!")
    sys.exit(1)

content = content.replace({repr(target_delegates_tab)}, {repr(replacement_delegates_tab)})

if {repr(target_delegates_settings)} not in content:
    print("Could not find delegates settings target! Let me try another search")
    sys.exit(1)

content = content.replace({repr(target_delegates_settings)}, {repr(replacement_delegates_settings)})

open("src/App.tsx", "w").write(content)
print("Success!")
''')

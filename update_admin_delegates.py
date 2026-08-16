content = open('src/App.tsx').read()
import re

pattern = re.compile(r'\) : reportsView === \'delegates_settings\' \? \(\n                <div className="space-y-6 pb-6">.*?</div>\n              \) : reportsView === \'delegates_settings\' \? \(\n                <div className="space-y-6 pb-6">.*?</div>\n              \) : reportsView === \'shifts\' \? \(', re.DOTALL)

replacement = """) : reportsView === 'delegates_settings' ? (
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
              ) : reportsView === 'shifts' ? ("""

match = pattern.search(content)
if match:
    new_content = content[:match.start()] + replacement + content[match.end():]
    open('src/App.tsx', 'w').write(new_content)
    print("Replaced delegates settings successfully.")
else:
    print("Could not find the double block. Looking for single block...")
    # fallback to just one block matching
    pattern2 = re.compile(r'\) : reportsView === \'delegates_settings\' \? \(\n                <div className="space-y-6 pb-6">.*?</div>\n              \) : reportsView === \'shifts\' \? \(', re.DOTALL)
    match2 = pattern2.search(content)
    if match2:
        new_content = content[:match2.start()] + replacement + content[match2.end():]
        open('src/App.tsx', 'w').write(new_content)
        print("Replaced single delegates settings successfully.")
    else:
        print("Could not find single block either.")

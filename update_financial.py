content = open('src/App.tsx').read()
target = """                  )}
                </div>
              ) : null}"""
replacement = """                  )}
                </div>
              ) : reportsView === 'financial' ? (
                <div className="space-y-6 pb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <button 
                      onClick={() => setReportsView('menu')}
                      className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 rotate-180" />
                    </button>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <DollarSign className="w-6 h-6 text-emerald-500" />
                      المالية والأرباح
                    </h2>
                  </div>

                  {(() => {
                    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
                    const totalCost = invoices.reduce((sum, inv) => {
                      return sum + inv.items.reduce((itemSum, item) => itemSum + ((item.purchasePrice || 0) * item.quantity), 0);
                    }, 0);
                    const totalProfit = totalRevenue - totalCost;
                    const itemsSold = invoices.reduce((sum, inv) => sum + inv.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

                    return (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center col-span-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-50 to-transparent dark:from-emerald-900/20 rounded-bl-full -z-10"></div>
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">صافي الأرباح</span>
                            <span className="text-3xl font-extrabold text-emerald-500 dark:text-emerald-400">
                              {totalProfit.toLocaleString()} <span className="text-sm">د.ع</span>
                            </span>
                          </div>
                          
                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">إجمالي الإيرادات</span>
                            <span className="text-xl font-bold text-blue-500 dark:text-blue-400">
                              {totalRevenue.toLocaleString()}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">إجمالي التكاليف</span>
                            <span className="text-xl font-bold text-red-500 dark:text-red-400">
                              {totalCost.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-3xl p-6 text-white shadow-md flex items-center justify-between">
                          <div>
                            <div className="text-blue-100 text-sm font-bold mb-1">إجمالي القطع المباعة</div>
                            <div className="text-2xl font-extrabold">{itemsSold} قطعة</div>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : null}"""
content = content.replace(target, replacement)
open('src/App.tsx', 'w').write(content)

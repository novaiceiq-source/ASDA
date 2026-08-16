import re

content = open('src/App.tsx').read()

target = """) : null}
            </motion.div>
          )}

          {activeTab === 'sales' && ("""

views_code = """) : reportsView === 'delegate_stats' ? (
                <div className="space-y-6 pb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <button 
                      onClick={() => setReportsView('menu')}
                      className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 rotate-180" />
                    </button>
                    <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <PieChart className="w-6 h-6 text-indigo-500" />
                      إحصائيات المبيعات
                    </h2>
                  </div>

                  <div className="grid gap-3">
                    {delegates.length === 0 ? (
                      <div className="text-center text-slate-500 py-8">لا يوجد مندوبين مسجلين</div>
                    ) : (
                      delegates.map(delegate => (
                        <button
                          key={delegate.id}
                          onClick={() => {
                            setStatsDelegateId(delegate.id);
                            setReportsView('delegate_stats_detail');
                          }}
                          className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors text-right"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-500">
                              <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 dark:text-slate-100">{delegate.name}</div>
                              <div className="text-sm text-slate-500">عرض مبيعات المندوب</div>
                            </div>
                          </div>
                          <ChevronLeft className="w-5 h-5 text-slate-400" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : reportsView === 'delegate_stats_detail' ? (
                <div className="space-y-6 pb-6">
                  {(() => {
                    const delegate = delegates.find(d => d.id === statsDelegateId);
                    if (!delegate) return null;

                    const now = new Date();
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

                    const delegateInvoices = invoices.filter(inv => inv.delegateId === delegate.id);
                    
                    let filteredInvoices = delegateInvoices;
                    if (statsPeriod === 'today') {
                      filteredInvoices = delegateInvoices.filter(inv => new Date(inv.date).getTime() >= startOfDay);
                    } else if (statsPeriod === 'week') {
                      filteredInvoices = delegateInvoices.filter(inv => new Date(inv.date).getTime() >= startOfWeek);
                    } else if (statsPeriod === 'month') {
                      filteredInvoices = delegateInvoices.filter(inv => new Date(inv.date).getTime() >= startOfMonth);
                    }

                    // Calculate items sold in this period
                    const itemStats: Record<string, {name: string, quantity: number, total: number}> = {};
                    let totalItemsQuantity = 0;
                    let totalItemsValue = 0;

                    filteredInvoices.forEach(inv => {
                      inv.items.forEach(item => {
                        if (!itemStats[item.id]) {
                          itemStats[item.id] = { name: item.name, quantity: 0, total: 0 };
                        }
                        itemStats[item.id].quantity += item.quantity;
                        itemStats[item.id].total += item.quantity * (item.sellPrice || 0);
                        totalItemsQuantity += item.quantity;
                        totalItemsValue += item.quantity * (item.sellPrice || 0);
                      });
                    });

                    const statsArray = Object.values(itemStats).sort((a, b) => b.quantity - a.quantity);

                    return (
                      <div>
                        <div className="flex items-center gap-3 mb-6">
                          <button 
                            onClick={() => setReportsView('delegate_stats')}
                            className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                          >
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                          </button>
                          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-indigo-500" />
                            {delegate.name}
                          </h2>
                        </div>

                        {/* Period Tabs */}
                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-6">
                          <button 
                            onClick={() => setStatsPeriod('today')}
                            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${statsPeriod === 'today' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                          >
                            اليوم
                          </button>
                          <button 
                            onClick={() => setStatsPeriod('week')}
                            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${statsPeriod === 'week' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                          >
                            هذا الأسبوع
                          </button>
                          <button 
                            onClick={() => setStatsPeriod('month')}
                            className={`flex-1 py-2 text-sm font-bold rounded-xl transition-all ${statsPeriod === 'month' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                          >
                            هذا الشهر
                          </button>
                        </div>

                        {/* Summary Card */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 shadow-md text-white flex justify-between items-center mb-6">
                          <div>
                            <div className="text-indigo-100 text-sm font-bold mb-1">إجمالي القطع المباعة</div>
                            <div className="text-3xl font-black">{totalItemsQuantity} <span className="text-base font-normal opacity-80">قطعة</span></div>
                          </div>
                          <div className="text-left">
                            <div className="text-indigo-100 text-sm font-bold mb-1">المبلغ الإجمالي</div>
                            <div className="text-xl font-bold">{totalItemsValue.toLocaleString()} د.ع</div>
                          </div>
                        </div>

                        {/* Items Sold */}
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 px-2">تفاصيل المبيعات</h3>
                          {statsArray.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-500 shadow-sm border border-slate-100 dark:border-slate-800">
                              لم يتم تسجيل مبيعات في هذه الفترة
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {statsArray.map((stat, idx) => (
                                <div key={idx} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 font-bold">
                                      {stat.quantity}
                                    </div>
                                    <div className="font-bold text-slate-800 dark:text-slate-100 text-base">{stat.name}</div>
                                  </div>
                                  <div className="font-bold text-slate-600 dark:text-slate-400 text-sm">
                                    {stat.total.toLocaleString()} د.ع
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
              ) : null}
            </motion.div>
          )}

          {activeTab === 'sales' && ("""

content = content.replace(target, views_code)
open('src/App.tsx', 'w').write(content)
print("Updated successfully")

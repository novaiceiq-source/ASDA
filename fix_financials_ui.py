import re

content = open('src/App.tsx').read()

pattern = re.compile(r"\) : reportsView === 'financial' \? \(\n                <div className=\"space-y-6 pb-6\">.*?\) : null\}", re.DOTALL)

replacement = """) : reportsView === 'financial' ? (
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
                        <DollarSign className="w-6 h-6 text-emerald-500" />
                        المالية والأرباح
                      </h2>
                    </div>
                    <button 
                      onClick={() => setExpenseModal({ isOpen: true, description: '', amount: '' })}
                      className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-bold text-sm active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      إضافة مصروف
                    </button>
                  </div>

                  {(() => {
                    const now = new Date();
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

                    let soldToday = 0;
                    let soldWeek = 0;
                    let soldMonth = 0;

                    invoices.forEach(inv => {
                      const invDate = new Date(inv.date).getTime();
                      const itemsCount = inv.items.reduce((sum, item) => sum + item.quantity, 0);
                      
                      if (invDate >= startOfDay) soldToday += itemsCount;
                      if (invDate >= startOfWeek) soldWeek += itemsCount;
                      if (invDate >= startOfMonth) soldMonth += itemsCount;
                    });

                    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
                    const totalCost = invoices.reduce((sum, inv) => {
                      return sum + inv.items.reduce((itemSum, item) => itemSum + ((item.purchasePrice || 0) * item.quantity), 0);
                    }, 0);
                    
                    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
                    
                    // الصندوق الكلي (Total Cash Box)
                    const totalBox = totalRevenue - totalExpenses;
                    // صافي الأرباح (Net Profit)
                    const totalProfit = totalRevenue - totalCost - totalExpenses;
                    const itemsSold = invoices.reduce((sum, inv) => sum + inv.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);

                    return (
                      <div className="space-y-6">
                        {/* Overall Financials */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-5 shadow-md flex flex-col items-center justify-center gap-2 text-center col-span-2 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -z-10"></div>
                            <span className="text-emerald-50 font-bold text-sm">صافي الأرباح الكلي</span>
                            <span className="text-3xl font-extrabold text-white">
                              {totalProfit.toLocaleString()} <span className="text-sm">د.ع</span>
                            </span>
                          </div>
                          
                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">الصندوق الكلي</span>
                            <span className="text-xl font-bold text-blue-500 dark:text-blue-400">
                              {totalBox.toLocaleString()}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">إجمالي الإيرادات</span>
                            <span className="text-xl font-bold text-indigo-500 dark:text-indigo-400">
                              {totalRevenue.toLocaleString()}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">تكلفة البضاعة</span>
                            <span className="text-xl font-bold text-orange-500 dark:text-orange-400">
                              {totalCost.toLocaleString()}
                            </span>
                          </div>

                          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center gap-2 text-center">
                            <span className="text-slate-500 dark:text-slate-400 font-bold text-sm">إجمالي المصاريف</span>
                            <span className="text-xl font-bold text-red-500 dark:text-red-400">
                              {totalExpenses.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Sold Items Stats */}
                        <div>
                          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 px-2">إحصائيات المبيعات (قطع)</h3>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 text-center">
                              <div className="text-blue-600 dark:text-blue-400 font-bold text-xs mb-1">اليوم</div>
                              <div className="text-xl font-extrabold text-blue-700 dark:text-blue-300">{soldToday}</div>
                            </div>
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 text-center">
                              <div className="text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-1">هذا الأسبوع</div>
                              <div className="text-xl font-extrabold text-indigo-700 dark:text-indigo-300">{soldWeek}</div>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-4 text-center">
                              <div className="text-purple-600 dark:text-purple-400 font-bold text-xs mb-1">هذا الشهر</div>
                              <div className="text-xl font-extrabold text-purple-700 dark:text-purple-300">{soldMonth}</div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Expenses List */}
                        {expenses.length > 0 && (
                          <div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 px-2">المصاريف المسجلة</h3>
                            <div className="space-y-3">
                              {expenses.slice(0, 10).map(exp => (
                                <div key={exp.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                                  <div>
                                    <div className="font-bold text-slate-800 dark:text-slate-100">{exp.description}</div>
                                    <div className="text-xs text-slate-500">{new Date(exp.date).toLocaleDateString('ar-IQ')}</div>
                                  </div>
                                  <div className="font-bold text-red-500 text-sm">
                                    - {exp.amount.toLocaleString()} د.ع
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                      </div>
                    );
                  })()}
                </div>
              ) : null}"""

match = pattern.search(content)
if match:
    new_content = content[:match.start()] + replacement + content[match.end():]
    open('src/App.tsx', 'w').write(new_content)
    print("UI replaced.")
else:
    print("Could not find the target to replace.")

import re

content = open('src/App.tsx').read()

# 1. Update statsPeriod state definition
state_target = "const [statsPeriod, setStatsPeriod] = useState<'today' | 'week' | 'month'>('today');"
state_replacement = "const [statsPeriod, setStatsPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');"
content = content.replace(state_target, state_replacement)

# 2. Update delegate_stats_detail logic
old_logic = """                  {(() => {
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

                    const statsArray = Object.values(itemStats).sort((a, b) => b.quantity - a.quantity);"""

new_logic = """                  {(() => {
                    const delegate = delegates.find(d => d.id === statsDelegateId);
                    if (!delegate) return null;

                    const now = new Date();
                    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay()).getTime();
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
                    const startOfYear = new Date(now.getFullYear(), 0, 1).getTime();

                    const delegateInvoices = invoices.filter(inv => inv.delegateId === delegate.id);
                    
                    let filteredInvoices = delegateInvoices;
                    if (statsPeriod === 'today') {
                      filteredInvoices = delegateInvoices.filter(inv => new Date(inv.date).getTime() >= startOfDay);
                    } else if (statsPeriod === 'week') {
                      filteredInvoices = delegateInvoices.filter(inv => new Date(inv.date).getTime() >= startOfWeek);
                    } else if (statsPeriod === 'month') {
                      filteredInvoices = delegateInvoices.filter(inv => new Date(inv.date).getTime() >= startOfMonth);
                    } else if (statsPeriod === 'year') {
                      filteredInvoices = delegateInvoices.filter(inv => new Date(inv.date).getTime() >= startOfYear);
                    }

                    // Calculate items sold in this period
                    const salesByItemId: Record<string, {quantity: number, total: number}> = {};
                    let totalItemsQuantity = 0;
                    let totalItemsValue = 0;

                    filteredInvoices.forEach(inv => {
                      inv.items.forEach(cartItem => {
                        const id = cartItem.itemId;
                        if (!salesByItemId[id]) {
                          salesByItemId[id] = { quantity: 0, total: 0 };
                        }
                        salesByItemId[id].quantity += cartItem.quantity;
                        salesByItemId[id].total += cartItem.quantity * (cartItem.sellPrice || 0);
                        totalItemsQuantity += cartItem.quantity;
                        totalItemsValue += cartItem.quantity * (cartItem.sellPrice || 0);
                      });
                    });

                    // Map all inventory items
                    const statsArray = items.map(invItem => {
                      const sales = salesByItemId[invItem.id] || { quantity: 0, total: 0 };
                      return {
                        name: invItem.name,
                        quantity: sales.quantity,
                        total: sales.total
                      };
                    });"""
content = content.replace(old_logic, new_logic)

# 3. Add the 'year' button to Period Tabs
tabs_target = """                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-6">
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
                        </div>"""

tabs_replacement = """                        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-6 overflow-x-auto hide-scrollbar">
                          <button 
                            onClick={() => setStatsPeriod('today')}
                            className={`flex-1 min-w-[70px] py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${statsPeriod === 'today' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                          >
                            اليوم
                          </button>
                          <button 
                            onClick={() => setStatsPeriod('week')}
                            className={`flex-1 min-w-[80px] py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${statsPeriod === 'week' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                          >
                            الأسبوع
                          </button>
                          <button 
                            onClick={() => setStatsPeriod('month')}
                            className={`flex-1 min-w-[80px] py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${statsPeriod === 'month' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                          >
                            الشهر
                          </button>
                          <button 
                            onClick={() => setStatsPeriod('year')}
                            className={`flex-1 min-w-[70px] py-2 text-xs md:text-sm font-bold rounded-xl transition-all ${statsPeriod === 'year' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                          >
                            سنوي
                          </button>
                        </div>"""
content = content.replace(tabs_target, tabs_replacement)

open('src/App.tsx', 'w').write(content)
print("Updated successfully")

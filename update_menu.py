import re

content = open('src/App.tsx').read()

menu_button = """                     <button 
                       onClick={() => setReportsView('financial')}
                       className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform"
                     >
                       <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-500 shadow-inner">
                         <DollarSign className="w-8 h-8" />
                       </div>
                       <span className="font-bold text-slate-800 dark:text-slate-100">المالية والأرباح</span>
                     </button>
                     
                     <button 
                       onClick={() => setReportsView('delegate_stats')}
                       className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform col-span-2"
                     >
                       <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-500 shadow-inner">
                         <PieChart className="w-8 h-8" />
                       </div>
                       <span className="font-bold text-slate-800 dark:text-slate-100">إحصائيات المبيعات</span>
                     </button>"""

target = """                     <button 
                       onClick={() => setReportsView('financial')}
                       className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform"
                     >
                       <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-500 shadow-inner">
                         <DollarSign className="w-8 h-8" />
                       </div>
                       <span className="font-bold text-slate-800 dark:text-slate-100">المالية والأرباح</span>
                     </button>"""

content = content.replace(target, menu_button)
open('src/App.tsx', 'w').write(content)
print("Updated menu.")

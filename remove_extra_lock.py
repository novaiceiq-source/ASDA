import re

content = open('src/App.tsx').read()

target = """                          <button 
                            onClick={() => setReportsView('delegate_stats')}
                            className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                          >
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                          </button>
                       
                     <button 
                       onClick={() => setReportsView('change_pin')}
                       className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_20px_-6px_rgba(0,0,0,0.3)] border border-slate-100/60 dark:border-slate-800 flex flex-col items-center justify-center gap-4 active:scale-95 transition-transform col-span-2"
                     >
                       <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-orange-900/40 flex items-center justify-center text-orange-500 shadow-inner">
                         <Lock className="w-8 h-8" />
                       </div>
                       <span className="font-bold text-slate-800 dark:text-slate-100">تغيير رمز الدخول</span>
                     </button>
                          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">"""

replacement = """                          <button 
                            onClick={() => setReportsView('delegate_stats')}
                            className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 active:scale-95 transition-all"
                          >
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                          </button>
                          <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">"""

if target in content:
    content = content.replace(target, replacement)
    open('src/App.tsx', 'w').write(content)
    print("Fixed.")
else:
    print("Target not found.")


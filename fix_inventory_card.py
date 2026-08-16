import re

content = open('src/App.tsx').read()

target = """                        <div className="flex gap-4 mb-4">
                          <div className="flex-1 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3 border border-slate-100 dark:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col justify-center items-center transition-colors duration-300">
                            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mb-1">الشراء</span>
                            <div className="flex items-baseline gap-1 text-slate-700 dark:text-slate-200 transition-colors duration-300">
                              <span className="font-extrabold text-lg">{item.purchasePrice}</span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">د.ع</span>
                            </div>
                          </div>
                          <div className="flex-1 bg-blue-50/40 dark:bg-blue-900/20 rounded-2xl p-3 border border-blue-100 dark:border-blue-900/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col justify-center items-center transition-colors duration-300">
                            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mb-1">البيع</span>
                            <div className="flex items-baseline gap-1 text-blue-800 dark:text-blue-300 transition-colors duration-300">
                              <span className="font-extrabold text-lg">{item.sellPrice}</span>
                              <span className="text-[10px] text-blue-400 dark:text-blue-500 font-bold">د.ع</span>
                            </div>
                          </div>
                        </div>"""

replacement = """                        <div className="flex gap-4 mb-4">
                          {isReportsUnlocked && (
                            <div className="flex-1 bg-slate-50 dark:bg-slate-800/80 rounded-2xl p-3 border border-slate-100 dark:border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col justify-center items-center transition-colors duration-300">
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold mb-1">الشراء</span>
                              <div className="flex items-baseline gap-1 text-slate-700 dark:text-slate-200 transition-colors duration-300">
                                <span className="font-extrabold text-lg">{item.purchasePrice}</span>
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold">د.ع</span>
                              </div>
                            </div>
                          )}
                          <div className="flex-1 bg-blue-50/40 dark:bg-blue-900/20 rounded-2xl p-3 border border-blue-100 dark:border-blue-900/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] dark:shadow-none flex flex-col justify-center items-center transition-colors duration-300">
                            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-bold mb-1">البيع</span>
                            <div className="flex items-baseline gap-1 text-blue-800 dark:text-blue-300 transition-colors duration-300">
                              <span className="font-extrabold text-lg">{item.sellPrice}</span>
                              <span className="text-[10px] text-blue-400 dark:text-blue-500 font-bold">د.ع</span>
                            </div>
                          </div>
                        </div>"""

if target in content:
    content = content.replace(target, replacement)
    open('src/App.tsx', 'w').write(content)
    print("Replaced successfully")
else:
    print("Target not found")

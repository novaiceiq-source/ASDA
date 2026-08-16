content = open('src/App.tsx').read()
target = """                            <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                              <button 
                                onClick={() => setViewedDelegateId(del.id)}
                                className="flex-[2] flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                الفواتير
                              </button>
                              <button 
                                onClick={() => setDelegateModal({ isOpen: true, id: del.id, name: del.name, whatsapp: del.whatsapp })}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm active:scale-95 transition-all"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteDelegate(del.id)}
                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-sm active:scale-95 transition-all"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>"""

replacement = """                            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                              <button 
                                onClick={() => setViewedDelegateId(del.id)}
                                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm shadow-md active:scale-95 transition-all"
                              >
                                <ShoppingCart className="w-4 h-4" />
                                عرض الفواتير والمبيعات
                              </button>
                            </div>"""

content = content.replace(target, replacement)
open('src/App.tsx', 'w').write(content)

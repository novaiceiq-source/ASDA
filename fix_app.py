content = open('src/App.tsx').read()

import re
# Find the broken section:
# className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-          {activeTab === 'delegates' && (
# and all the way to `عرض الفواتير والمبيعات\n                              </button>`

# Let's just restore from a backup? I don't have one.
# So let's craft a regex to find the broken part and replace it.

pattern = re.compile(r'onClick=\{\(\) => setAddQuantityModal\(\{ isOpen: true, itemId: item\.id, itemName: item\.name, addedQuantity: \'\', shift: \'الشفت الاول\' \}\)\}\n                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-(.*?)عرض الفواتير والمبيعات\n                              </button>', re.DOTALL)

match = pattern.search(content)
if match:
    # replace the match with the correct Add Quantity button, closing the div etc.
    # The original "Add quantity" button in activeTab === 'inventory':
    correct_end_of_inventory = """onClick={() => setAddQuantityModal({ isOpen: true, itemId: item.id, itemName: item.name, addedQuantity: '', shift: 'الشفت الاول' })}
                          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 active:scale-95 transition-all"
                        >
                          <Plus className="w-5 h-5" />
                          إضافة إنتاج
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}"""
          
    # And then the correct replacement for delegates without the button:
    correct_delegates_tab = """
          {activeTab === 'delegates' && (
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
          
    new_text = correct_end_of_inventory + correct_delegates_tab
    content = content[:match.start()] + new_text + content[match.end():]
    open('src/App.tsx', 'w').write(content)
    print("Fixed!")
else:
    print("Pattern not found!")


import re

content = open('src/App.tsx').read()

# 1. State definitions
state_target = "const [statsPeriod, setStatsPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');"
state_replacement = "const [statsPeriod, setStatsPeriod] = useState<'today' | 'week' | 'month' | 'year'>('today');\n  const [draftInvoice, setDraftInvoice] = useState<Invoice | null>(null);"
if state_target in content:
    content = content.replace(state_target, state_replacement)
else:
    print("Could not find state target")

# 2. Logic functions
func_target = "const handleUnlockReports = (e: React.FormEvent) => {"
funcs = """  const handleDraftUpdateQty = (itemId: string, delta: number) => {
    if (!draftInvoice) return;
    setDraftInvoice({
      ...draftInvoice,
      items: draftInvoice.items.map(item =>
        item.itemId === itemId ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      )
    });
  };

  const handleDraftSetQty = (itemId: string, quantity: number) => {
    if (!draftInvoice) return;
    setDraftInvoice({
      ...draftInvoice,
      items: draftInvoice.items.map(item =>
        item.itemId === itemId ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    });
  };

  const handleSaveInvoiceEdit = () => {
    if (!draftInvoice) return;
    const originalInvoice = invoices.find(i => i.id === draftInvoice.id);
    if (!originalInvoice) return;

    let hasError = false;
    const inventoryUpdates = new Map<string, number>();

    const draftItemsMap = new Map(draftInvoice.items.map(i => [i.itemId, i]));

    originalInvoice.items.forEach(origItem => {
      const draftItem = draftItemsMap.get(origItem.itemId);
      const draftQty = draftItem ? draftItem.quantity : 0;
      const diff = draftQty - origItem.quantity;
      inventoryUpdates.set(origItem.itemId, diff);
    });

    draftInvoice.items.forEach(draftItem => {
       if (!inventoryUpdates.has(draftItem.itemId)) {
          inventoryUpdates.set(draftItem.itemId, draftItem.quantity);
       }
    });

    for (const [itemId, diff] of Array.from(inventoryUpdates.entries())) {
       if (diff > 0) {
          const invItem = items.find(i => i.id === itemId);
          if (!invItem || Number(invItem.quantity) < diff) {
             const itemName = draftInvoice.items.find(i => i.itemId === itemId)?.name || 'عنصر';
             showToast(`الكمية المتوفرة لا تكفي لـ ${itemName}`, 'error');
             hasError = true;
             break;
          }
       }
    }

    if (hasError) return;

    const newItems = items.map(invItem => {
       const diff = inventoryUpdates.get(invItem.id);
       if (diff !== undefined) {
          return { ...invItem, quantity: String(Number(invItem.quantity) - diff) };
       }
       return invItem;
    });

    const validDraftItems = draftInvoice.items.filter(i => i.quantity > 0);
    if (validDraftItems.length === 0) {
      setInvoices(invoices.filter(inv => inv.id !== draftInvoice.id));
    } else {
      const newTotalAmount = validDraftItems.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0);
      const finalInvoice = { ...draftInvoice, totalAmount: newTotalAmount, items: validDraftItems };
      setInvoices(invoices.map(inv => inv.id === finalInvoice.id ? finalInvoice : inv));
    }

    setItems(newItems);
    setDraftInvoice(null);
    showToast('تم حفظ تعديلات الفاتورة بنجاح', 'success');
  };

  const handleUnlockReports = (e: React.FormEvent) => {"""
if func_target in content:
    content = content.replace(func_target, funcs)
else:
    print("Could not find func target")

# 3. Add UI below items sold
ui_target = """                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );"""

ui_replacement = """                              ))}
                            </div>
                          )}
                        </div>

                        {/* Recent Invoices List */}
                        <div className="mt-8">
                          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 px-2">العمليات الأخيرة</h3>
                          {filteredInvoices.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-500 shadow-sm border border-slate-100 dark:border-slate-800">
                              لا توجد عمليات بيع لهذه الفترة
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {filteredInvoices.slice().reverse().map((inv) => (
                                <div key={inv.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                                  <div className="flex justify-between items-center mb-3">
                                    <div>
                                      <div className="text-sm font-semibold text-slate-500">{new Date(inv.date).toLocaleString('ar-IQ', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' })}</div>
                                      <div className="font-bold text-slate-800 dark:text-slate-100 text-xs mt-0.5">{inv.id}</div>
                                    </div>
                                    <div className="text-left">
                                      <div className="font-black text-indigo-600 dark:text-indigo-400 text-lg">{inv.totalAmount.toLocaleString()} د.ع</div>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center border-t border-slate-100 dark:border-slate-800 pt-3">
                                    <div className="text-sm font-bold text-slate-500">{inv.items.reduce((s, i) => s + i.quantity, 0)} قطع مباعة</div>
                                    <button 
                                      onClick={() => setDraftInvoice(JSON.parse(JSON.stringify(inv)))}
                                      className="flex items-center gap-1.5 text-sm font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-xl hover:bg-orange-100 dark:hover:bg-orange-900/40 transition-colors active:scale-95"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                      تعديل הפاتورة
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                      </div>
                    );"""

# Fix "ה" to "الفاتورة"
ui_replacement = ui_replacement.replace('تعديل הפاتورة', 'تعديل الفاتورة')

if ui_target in content:
    content = content.replace(ui_target, ui_replacement)
else:
    print("Could not find ui target")

# 4. Add Edit Modal
modal_target = "</main>"
modal_replacement = """  <AnimatePresence>
            {draftInvoice && (
              <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 sm:p-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
                  onClick={() => setDraftInvoice(null)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 100, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 100, scale: 0.95 }}
                  className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl relative z-10 max-h-[90vh] flex flex-col"
                >
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <div>
                      <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Edit2 className="w-6 h-6 text-orange-500" />
                        تعديل الفاتورة
                      </h2>
                      <div className="text-xs font-bold text-slate-500 mt-1">{draftInvoice.id}</div>
                    </div>
                    <button onClick={() => setDraftInvoice(null)} className="p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors active:scale-95">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-1 space-y-3">
                    {draftInvoice.items.map((item, idx) => (
                      <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700 flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-800 dark:text-slate-100">{item.name}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{item.sellPrice.toLocaleString()} د.ع</div>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-xl p-1 shadow-sm border border-slate-200 dark:border-slate-700">
                          <button onClick={() => handleDraftUpdateQty(item.itemId, 1)} className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg active:scale-95 transition-colors"><Plus className="w-4 h-4" /></button>
                          <input 
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              handleDraftSetQty(item.itemId, isNaN(val) ? 0 : val);
                            }}
                            className="font-bold w-12 text-center bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-100 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none p-0 m-0"
                          />
                          <button onClick={() => handleDraftUpdateQty(item.itemId, -1)} className="w-8 h-8 flex items-center justify-center bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg active:scale-95 transition-colors"><Minus className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add new item to invoice optional dropdown */}
                    <div className="mt-6 border-t border-slate-200 dark:border-slate-700 pt-5">
                       <label className="block text-sm font-bold text-slate-600 dark:text-slate-400 mb-2 px-1">إضافة عنصر آخر للفاتورة:</label>
                       <select 
                         className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 font-bold text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 transition-colors"
                         onChange={(e) => {
                           if (!e.target.value) return;
                           const selectedInvItem = items.find(i => i.id === e.target.value);
                           if (!selectedInvItem) return;
                           if (draftInvoice.items.some(i => i.itemId === selectedInvItem.id)) {
                              e.target.value = '';
                              return;
                           }
                           
                           setDraftInvoice({
                             ...draftInvoice,
                             items: [...draftInvoice.items, {
                               itemId: selectedInvItem.id,
                               name: selectedInvItem.name,
                               quantity: 1,
                               sellPrice: Number(selectedInvItem.sellPrice),
                               purchasePrice: Number(selectedInvItem.purchasePrice)
                             }]
                           });
                           e.target.value = '';
                         }}
                       >
                         <option value="">اختر منتجاً لإضافته...</option>
                         {items.filter(i => !draftInvoice.items.some(di => di.itemId === i.id)).map(item => (
                           <option key={item.id} value={item.id}>{item.name}</option>
                         ))}
                       </select>
                    </div>

                  </div>
                  
                  <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20 rounded-b-3xl">
                    <div className="flex justify-between items-center mb-4 px-2">
                      <span className="font-bold text-slate-500">الإجمالي بعد التعديل:</span>
                      <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        {draftInvoice.items.reduce((sum, i) => sum + (i.quantity * i.sellPrice), 0).toLocaleString()} د.ع
                      </span>
                    </div>
                    <button 
                      onClick={handleSaveInvoiceEdit}
                      className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg active:scale-95 transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      حفظ التعديلات في النظام
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </main>"""

if modal_target in content:
    content = content.replace(modal_target, modal_replacement)
else:
    print("Could not find modal target")

open('src/App.tsx', 'w').write(content)
print("All edits applied.")

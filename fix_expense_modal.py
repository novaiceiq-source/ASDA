import re

content = open('src/App.tsx').read()

expense_modal_jsx = """
      {/* Expense Modal */}
      <AnimatePresence>
        {expenseModal.isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm z-[150] transition-colors duration-300"
              onClick={() => setExpenseModal({ isOpen: false, description: '', amount: '' })}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[150] w-full max-w-sm px-4"
            >
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/40 flex items-center justify-center text-red-500">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">إضافة مصروف</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">وصف المصروف</label>
                    <input 
                      type="text"
                      placeholder="مثال: شراء أكياس، رواتب..."
                      value={expenseModal.description}
                      onChange={(e) => setExpenseModal({ ...expenseModal, description: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-colors font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">المبلغ (د.ع)</label>
                    <input 
                      type="number"
                      placeholder="0"
                      value={expenseModal.amount}
                      onChange={(e) => setExpenseModal({ ...expenseModal, amount: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-800 dark:text-slate-100 focus:border-red-500 focus:outline-none transition-colors font-medium text-sm"
                    />
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => setExpenseModal({ isOpen: false, description: '', amount: '' })}
                      className="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold active:scale-95 transition-all text-sm"
                    >
                      إلغاء
                    </button>
                    <button 
                      onClick={handleSaveExpense}
                      className="flex-1 py-3.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold active:scale-95 transition-all text-sm shadow-md shadow-red-500/20"
                    >
                      حفظ المصروف
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}"""

content = content.replace("{/* Toast Notification */}", expense_modal_jsx)
open('src/App.tsx', 'w').write(content)

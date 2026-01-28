import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Moon, Sun, Award, Flame, X, Check, Calendar, Trophy, Target, Zap } from 'lucide-react';

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'Учёба', color: '#667eea' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [expandedHabit, setExpandedHabit] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showAchievements, setShowAchievements] = useState(false);

  const categories = ['Учёба', 'Здоровье', 'Спорт', 'Работа', 'Личное'];
  const categoryIcons = {
    'Учёба': '📚',
    'Здоровье': '🍎',
    'Спорт': '💪',
    'Работа': '💼',
    'Личное': '✨'
  };

  const habitColors = [
    { name: 'Фиолетовый', value: '#667eea' },
    { name: 'Синий', value: '#4299e1' },
    { name: 'Зелёный', value: '#48bb78' },
    { name: 'Оранжевый', value: '#ed8936' },
    { name: 'Розовый', value: '#ed64a6' },
    { name: 'Красный', value: '#f56565' }
  ];

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedName = localStorage.getItem('userName');
    if (savedHabits) setHabits(JSON.parse(savedHabits));
    if (savedName) setUserName(savedName);
    else setShowNameInput(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    if (userName) localStorage.setItem('userName', userName);
  }, [userName]);

  const addHabit = () => {
    if (!newHabit.name.trim()) return;
    
    const habit = {
      id: Date.now(),
      name: newHabit.name,
      category: newHabit.category,
      color: newHabit.color,
      completedDates: [],
      createdAt: new Date().toISOString()
    };
    
    setHabits([...habits, habit]);
    setNewHabit({ name: '', category: 'Учёба', color: '#667eea' });
    setShowAddForm(false);
  };

  const deleteHabit = (id) => {
    setConfirmDelete(id);
  };

  const toggleCompletion = (habitId, date) => {
    const dateStr = date.toDateString();
    
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completed = habit.completedDates || [];
        const isCompleted = completed.includes(dateStr);
        
        return {
          ...habit,
          completedDates: isCompleted
            ? completed.filter(d => d !== dateStr)
            : [...completed, dateStr]
        };
      }
      return habit;
    }));
  };

  const toggleTodayCompletion = (habitId) => {
    toggleCompletion(habitId, new Date());
  };

  const getCurrentMonthDays = () => {
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(now.getFullYear(), now.getMonth(), day));
    }
    return days;
  };

  const isCompletedOnDate = (habit, date) => {
    return (habit.completedDates || []).includes(date.toDateString());
  };

  const isCompletedToday = (habit) => {
    return (habit.completedDates || []).includes(new Date().toDateString());
  };

  const getStreak = (habit) => {
    const dates = [...(habit.completedDates || [])].sort((a, b) => new Date(b) - new Date(a));
    if (dates.length === 0) return 0;
    
    let streak = 0;
    const currentDate = new Date();
    
    for (let i = 0; i < dates.length; i++) {
      const completedDate = new Date(dates[i]);
      const diffDays = Math.floor((currentDate - completedDate) / (1000 * 60 * 60 * 24));
      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getMonthlyCompletion = (habit) => {
    const monthDays = getCurrentMonthDays();
    const today = new Date();
    const daysPassedInMonth = today.getDate();
    const completedInMonth = monthDays.filter(day => day <= today && isCompletedOnDate(habit, day)).length;
    return daysPassedInMonth > 0 ? Math.round((completedInMonth / daysPassedInMonth) * 100) : 0;
  };

  const getTotalCompletions = () => {
    return habits.reduce((total, habit) => total + (habit.completedDates?.length || 0), 0);
  };

  const getAchievements = () => {
    const achievements = [];
    const totalCompletions = getTotalCompletions();
    const maxStreak = Math.max(...habits.map(h => getStreak(h)), 0);
    
    if (totalCompletions >= 1) achievements.push({ icon: '🎯', title: 'Первый шаг', desc: 'Выполнена первая привычка' });
    if (totalCompletions >= 10) achievements.push({ icon: '⭐', title: 'Новичок', desc: '10 выполнений' });
    if (totalCompletions >= 50) achievements.push({ icon: '🌟', title: 'Энтузиаст', desc: '50 выполнений' });
    if (totalCompletions >= 100) achievements.push({ icon: '💫', title: 'Мастер', desc: '100 выполнений' });
    if (maxStreak >= 3) achievements.push({ icon: '🔥', title: 'На разогреве', desc: '3 дня подряд' });
    if (maxStreak >= 7) achievements.push({ icon: '🚀', title: 'Неделя силы', desc: '7 дней подряд' });
    if (maxStreak >= 30) achievements.push({ icon: '👑', title: 'Легенда', desc: '30 дней подряд' });
    if (habits.length >= 5) achievements.push({ icon: '📚', title: 'Коллекционер', desc: '5+ привычек' });
    
    return achievements;
  };

  const stats = {
    active: habits.length,
    achievements: getAchievements().length,
    maxStreak: Math.max(...habits.map(h => getStreak(h)), 0),
    totalCompletions: getTotalCompletions(),
    todayCompleted: habits.filter(h => isCompletedToday(h)).length
  };

  const motivationalMessages = [
    'Ты сильнее, чем думаешь! 💪',
    'Каждый день - новая возможность! ✨',
    'Маленькие шаги ведут к большим целям! 🎯',
    'Продолжай в том же духе! 🚀',
    'Ты молодец! Продолжай! 🌟',
    'Прогресс важнее совершенства! 📈',
    'Сегодня лучше, чем вчера! ⚡'
  ];

  const [currentMessage] = useState(
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  );

  const monthDays = getCurrentMonthDays();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-50`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userName ? userName[0].toUpperCase() : 'H'}
              </div>
              <h1 className="text-lg font-bold">Habit Tracker</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAchievements(true)} className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </button>
              <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button onClick={() => { localStorage.clear(); setUserName(''); setHabits([]); setShowNameInput(true); }} className="text-sm text-gray-400 hover:text-white px-2">
                Выход
              </button>
            </div>
          </div>
        </div>
      </header>

      {showNameInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm`}>
            <h2 className="text-xl font-bold mb-4">Как вас зовут?</h2>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && userName && setShowNameInput(false)} placeholder="Введите ваше имя" className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'} outline-none text-base`} autoFocus />
            <button onClick={() => userName && setShowNameInput(false)} disabled={!userName} className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-xl font-medium disabled:opacity-50">
              Начать
            </button>
          </div>
        </div>
      )}

      {showAchievements && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                Достижения
              </h2>
              <button onClick={() => setShowAchievements(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {getAchievements().map((achievement, idx) => (
                <div key={idx} className={`${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-xl p-4 text-center`}>
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h3 className="font-bold text-sm mb-1">{achievement.title}</h3>
                  <p className="text-xs text-gray-400">{achievement.desc}</p>
                </div>
              ))}
              {getAchievements().length === 0 && (
                <div className="col-span-2 text-center py-8 text-gray-400">
                  <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Выполняйте привычки, чтобы получить достижения!</p>
                </div>
              )}
            </div>
            <div className={`mt-6 p-4 rounded-xl ${isDark ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
              <h3 className="font-bold mb-2">Ваш прогресс:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Всего выполнений:</span>
                  <span className="font-bold">{stats.totalCompletions}</span>
                </div>
                <div className="flex justify-between">
                  <span>Лучшая серия:</span>
                  <span className="font-bold">{stats.maxStreak} дней</span>
                </div>
                <div className="flex justify-between">
                  <span>Активных привычек:</span>
                  <span className="font-bold">{stats.active}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm`}>
            <h2 className="text-xl font-bold mb-2">Удалить привычку?</h2>
            <p className="text-gray-400 mb-6">{habits.find(h => h.id === confirmDelete)?.name}</p>
            <div className="flex gap-3">
              <button onClick={() => { setHabits(habits.filter(h => h.id !== confirmDelete)); setConfirmDelete(null); }} className="flex-1 bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600">
                Удалить
              </button>
              <button onClick={() => setConfirmDelete(null)} className={`flex-1 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} py-3 rounded-xl font-medium`}>
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[100]">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl p-6 w-full max-w-lg`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Новая привычка</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2"><X className="w-6 h-6" /></button>
            </div>
            <input type="text" value={newHabit.name} onChange={(e) => setNewHabit({...newHabit, name: e.target.value})} placeholder="Название привычки" className={`w-full px-4 py-3 rounded-xl mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} outline-none text-base`} autoFocus />
            <select value={newHabit.category} onChange={(e) => setNewHabit({...newHabit, category: e.target.value})} className={`w-full px-4 py-3 rounded-xl mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} outline-none text-base`}>
              {categories.map(cat => <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>)}
            </select>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Цвет привычки</label>
              <div className="grid grid-cols-6 gap-2">
                {habitColors.map(color => (
                  <button key={color.value} onClick={() => setNewHabit({...newHabit, color: color.value})} className={`w-full aspect-square rounded-lg transition-all ${newHabit.color === color.value ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''}`} style={{backgroundColor: color.value}} />
                ))}
              </div>
            </div>
            <button onClick={addHabit} className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-4 rounded-xl font-medium text-base">
              Создать привычку
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-4 pb-24">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-1">Привет, {userName}! 👋</h2>
          <p className="text-sm text-gray-400">Сегодня выполнено: {stats.todayCompleted} из {stats.active}</p>
        </div>

        <div className={`${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-100 to-purple-100'} rounded-2xl p-4 mb-4 text-center`}>
          <p className="text-base font-medium">{currentMessage}</p>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-3`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-2 mx-auto`}>
              <Target className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-400 text-[10px] text-center mb-1">Привычек</p>
            <p className="text-xl font-bold text-center">{stats.active}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-3`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center mb-2 mx-auto`}>
              <Award className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-400 text-[10px] text-center mb-1">Наград</p>
            <p className="text-xl font-bold text-center">{stats.achievements}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-3`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-2 mx-auto`}>
              <Flame className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-400 text-[10px] text-center mb-1">Серия</p>
            <p className="text-xl font-bold text-center">{stats.maxStreak}</p>
          </div>
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-3`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-2 mx-auto`}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <p className="text-gray-400 text-[10px] text-center mb-1">Всего</p>
            <p className="text-xl font-bold text-center">{stats.totalCompletions}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Мои привычки</h3>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-gray-400 text-lg mb-2">Пока нет привычек</p>
            <p className="text-gray-500 text-sm">Нажмите + чтобы добавить первую</p>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {habits.map(habit => {
              const isExpanded = expandedHabit === habit.id;
              const completedToday = isCompletedToday(habit);
              const streak = getStreak(habit);
              const completion = getMonthlyCompletion(habit);
              
              return (
                <div key={habit.id} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl overflow-hidden`} style={{borderLeft: `4px solid ${habit.color}`}}>
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="text-3xl">{categoryIcons[habit.category]}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base mb-1">{habit.name}</h4>
                        <p className="text-xs text-gray-400">{habit.category}</p>
                      </div>
                      <button onClick={() => deleteHabit(habit.id)} className="text-gray-400 hover:text-red-500 p-2 -m-1">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4 mb-3 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-4 h-4" style={{color: habit.color}} />
                        <span className="font-bold" style={{color: habit.color}}>{streak} дней</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-400">За месяц:</span>
                        <span className="font-bold" style={{color: habit.color}}>{completion}%</span>
                      </div>
                    </div>
                    <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2 mb-4 overflow-hidden`}>
                      <div className="h-2 rounded-full transition-all duration-500" style={{width: `${completion}%`, backgroundColor: habit.color}} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => toggleTodayCompletion(habit.id)} className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${completedToday ? 'bg-green-500 text-white' : 'text-white hover:opacity-90'}`} style={{backgroundColor: completedToday ? undefined : habit.color}}>
                        <Check className="w-5 h-5" />
                        {completedToday ? 'Выполнено' : 'Отметить'}
                      </button>
                      <button onClick={() => setExpandedHabit(isExpanded ? null : habit.id)} className={`px-4 py-3 rounded-xl font-medium text-sm flex items-center gap-2 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'} p-4`}>
                      <h5 className="text-sm font-medium mb-3 text-gray-400">
                        {new Date().toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
                      </h5>
                      <div className="grid grid-cols-7 gap-1.5">
                        {monthDays.map((day, idx) => {
                          const isCompleted = isCompletedOnDate(habit, day);
                          const isToday = day.toDateString() === new Date().toDateString();
                          const isPast = day < new Date().setHours(0, 0, 0, 0);
                          
                          return (
                            <button key={idx} onClick={() => toggleCompletion(habit.id, day)} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${isToday ? 'ring-2' : ''} ${isPast && !isCompleted && !isToday ? 'opacity-40' : ''}`} style={{backgroundColor: isCompleted ? habit.color : isDark ? '#374151' : '#e5e7eb', color: isCompleted ? 'white' : undefined, borderColor: isToday ? habit.color : undefined}}>
                              {day.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <button onClick={() => setShowAddForm(true)} className="fixed right-5 bottom-5 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-40">
        <Plus className="w-7 h-7" />
      </button>
    </div>
  );
}

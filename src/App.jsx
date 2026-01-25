import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Moon, Sun, BarChart3, Award, Flame, X } from 'lucide-react';

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [userName, setUserName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [newHabit, setNewHabit] = useState({ name: '', category: 'Учёба' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const categories = ['Учёба', 'Здоровье', 'Спорт', 'Работа', 'Личное'];
  const categoryIcons = {
    'Учёба': '📚',
    'Здоровье': '🍎',
    'Спорт': '💪',
    'Работа': '💼',
    'Личное': '✨'
  };

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
      completedDates: [],
      createdAt: new Date().toISOString()
    };
    
    setHabits([...habits, habit]);
    setNewHabit({ name: '', category: 'Учёба' });
    setShowAddForm(false);
  };

  const deleteHabit = (id) => {
    if (confirm('Удалить эту привычку?')) {
      setHabits(habits.filter(h => h.id !== id));
    }
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

  const getCurrentMonthDays = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  };

  const isCompletedOnDate = (habit, date) => {
    const dateStr = date.toDateString();
    return (habit.completedDates || []).includes(dateStr);
  };

  const getStreak = (habit) => {
    const dates = [...(habit.completedDates || [])].sort((a, b) => 
      new Date(b) - new Date(a)
    );
    
    if (dates.length === 0) return 0;
    
    let streak = 0;
    let currentDate = new Date();
    
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
    
    const completedInMonth = monthDays.filter(day => 
      day <= today && isCompletedOnDate(habit, day)
    ).length;
    
    return Math.round((completedInMonth / daysPassedInMonth) * 100);
  };

  const stats = {
    active: habits.length,
    achievements: habits.filter(h => getStreak(h) >= 7).length,
    maxStreak: Math.max(...habits.map(h => getStreak(h)), 0)
  };

  const motivationalMessages = [
    'Ты сильнее, чем думаешь! 💪',
    'Каждый день - новая возможность! ✨',
    'Маленькие шаги ведут к большим целям! 🎯',
    'Продолжай в том же духе! 🚀',
    'Ты молодец! Продолжай! 🌟'
  ];

  const [currentMessage] = useState(
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  );

  const monthDays = getCurrentMonthDays();

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header - Mobile Optimized */}
      <header className={`${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg sticky top-0 z-10`}>
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userName ? userName[0].toUpperCase() : 'H'}
              </div>
              <h1 className="text-lg font-bold">Habit Tracker</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button className={`p-2 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  if (confirm('Выйти и очистить все данные?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                className="text-sm text-gray-400 px-2"
              >
                Выход
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Name Input Modal */}
      {showNameInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 w-full max-w-sm`}>
            <h2 className="text-xl font-bold mb-4">Как вас зовут?</h2>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && userName && setShowNameInput(false)}
              placeholder="Введите ваше имя"
              className={`w-full px-4 py-3 rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'} outline-none text-base`}
              autoFocus
            />
            <button
              onClick={() => userName && setShowNameInput(false)}
              disabled={!userName}
              className="w-full mt-4 bg-blue-500 text-white py-3 rounded-xl font-medium disabled:opacity-50"
            >
              Начать
            </button>
          </div>
        </div>
      )}

      {/* Add Habit Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-t-3xl p-6 w-full max-w-lg`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Новая привычка</h3>
              <button onClick={() => setShowAddForm(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <input
              type="text"
              value={newHabit.name}
              onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
              placeholder="Название привычки"
              className={`w-full px-4 py-3 rounded-xl mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} outline-none text-base`}
              autoFocus
            />
            <select
              value={newHabit.category}
              onChange={(e) => setNewHabit({...newHabit, category: e.target.value})}
              className={`w-full px-4 py-3 rounded-xl mb-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'} outline-none text-base`}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{categoryIcons[cat]} {cat}</option>
              ))}
            </select>
            <button
              onClick={addHabit}
              className="w-full bg-blue-500 text-white py-4 rounded-xl font-medium text-base"
            >
              Создать привычку
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-4 pb-20">
        {/* Welcome Section */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-1">
            Добро пожаловать, {userName || 'Алла'}!
          </h2>
          <p className="text-sm text-gray-400">Отслеживайте свои привычки и достигайте целей</p>
        </div>

        {/* Motivational Message */}
        <div className={`${isDark ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-100 to-purple-100'} rounded-2xl p-4 mb-4 text-center`}>
          <p className="text-base font-medium">{currentMessage}</p>
        </div>

        {/* Stats - Mobile Grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-3`}>
            <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-blue-900' : 'bg-blue-100'} flex items-center justify-center mb-2 mx-auto`}>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-gray-400 text-[10px] text-center mb-1 leading-tight">Активных<br/>привычек</p>
            <p className="text-2xl font-bold text-center">{stats.active}</p>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-3`}>
            <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-yellow-900' : 'bg-yellow-100'} flex items-center justify-center mb-2 mx-auto`}>
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-gray-400 text-[10px] text-center mb-1 leading-tight">Достижений</p>
            <p className="text-2xl font-bold text-center">{stats.achievements}</p>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-3`}>
            <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-orange-900' : 'bg-orange-100'} flex items-center justify-center mb-2 mx-auto`}>
              <Flame className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-gray-400 text-[10px] text-center mb-1 leading-tight">Дней<br/>подряд</p>
            <p className="text-2xl font-bold text-center">{stats.maxStreak}</p>
          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">Мои привычки</h3>
        </div>

        {/* Habits List */}
        {habits.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-6">Пока нет привычек</p>
          </div>
        ) : (
          <div className="space-y-3 mb-4">
            {habits.map(habit => (
              <div key={habit.id} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-4`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-2xl">{categoryIcons[habit.category]}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{habit.name}</h4>
                      <p className="text-xs text-gray-400">{habit.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-gray-400 p-1 flex-shrink-0"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-400">Серия</span>
                    <span className="font-bold text-orange-500">{getStreak(habit)}</span>
                  </div>
                  <div className="text-gray-400">
                    За месяц: <span className="text-blue-500 font-medium">{getMonthlyCompletion(habit)}%</span>
                  </div>
                </div>

                <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-100'} rounded-full h-2 mb-3`}>
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{width: `${getMonthlyCompletion(habit)}%`}}
                  />
                </div>

                {/* Calendar Grid - Mobile Optimized */}
                <div className="grid grid-cols-7 gap-1">
                  {monthDays.map((day, idx) => {
                    const isCompleted = isCompletedOnDate(habit, day);
                    const isToday = day.toDateString() === new Date().toDateString();
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => toggleCompletion(habit.id, day)}
                        className={`
                          aspect-square rounded-lg flex items-center justify-center text-xs font-medium
                          ${isCompleted ? 'bg-green-500 text-white' : isDark ? 'bg-gray-700' : 'bg-gray-200'}
                          ${isToday ? 'ring-2 ring-blue-500' : ''}
                          active:scale-95 transition-transform
                        `}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowAddForm(true)}
        className="fixed right-4 bottom-4 w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform z-20"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}

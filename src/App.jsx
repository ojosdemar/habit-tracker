import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, TrendingUp, Calendar } from 'lucide-react';

export default function HabitTracker() {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // Загрузка данных при старте
  useEffect(() => {
    const saved = localStorage.getItem('habits');
    if (saved) {
      setHabits(JSON.parse(saved));
    }
  }, []);

  // Сохранение при изменении
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  // Добавить новую привычку
  const addHabit = () => {
    if (!newHabitName.trim()) return;
    
    const newHabit = {
      id: Date.now(),
      name: newHabitName,
      completedDates: [],
      createdAt: new Date().toISOString()
    };
    
    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setShowAddForm(false);
  };

  // Удалить привычку
  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  // Переключить выполнение за сегодня
  const toggleToday = (habitId) => {
    const today = new Date().toDateString();
    
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const completed = habit.completedDates || [];
        const isCompletedToday = completed.includes(today);
        
        return {
          ...habit,
          completedDates: isCompletedToday
            ? completed.filter(d => d !== today)
            : [...completed, today]
        };
      }
      return habit;
    }));
  };

  // Проверить выполнена ли привычка сегодня
  const isCompletedToday = (habit) => {
    const today = new Date().toDateString();
    return (habit.completedDates || []).includes(today);
  };

  // Получить streak (серию дней подряд)
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

  // Получить последние 7 дней
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
    return days;
  };

  // Проверить выполнена ли привычка в определенный день
  const isCompletedOnDate = (habit, date) => {
    const dateStr = date.toDateString();
    return (habit.completedDates || []).includes(dateStr);
  };

  const last7Days = getLast7Days();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Мои привычки</h1>
              <p className="text-gray-600 mt-1">Отслеживайте свой прогресс каждый день</p>
            </div>
            <Calendar className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Кнопка добавления */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-6 hover:border-purple-500 hover:bg-purple-50 transition-all duration-200 flex items-center justify-center gap-2 text-gray-600 hover:text-purple-600"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Добавить новую привычку</span>
          </button>
        )}

        {/* Форма добавления */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="font-semibold text-lg mb-4">Новая привычка</h3>
            <input
              type="text"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addHabit()}
              placeholder="Например: Выпить 2 литра воды"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={addHabit}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Создать
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewHabitName('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Отмена
              </button>
            </div>
          </div>
        )}

        {/* Список привычек */}
        <div className="space-y-4 mt-6">
          {habits.length === 0 && !showAddForm && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <TrendingUp className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Пока нет привычек
              </h3>
              <p className="text-gray-500">
                Добавьте первую привычку, чтобы начать отслеживание
              </p>
            </div>
          )}

          {habits.map(habit => (
            <div
              key={habit.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{getStreak(habit)}</span>
                        <span>дней подряд</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Всего: {(habit.completedDates || []).length} дней
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Календарь последних 7 дней */}
                <div className="grid grid-cols-7 gap-2">
                  {last7Days.map((date, idx) => {
                    const isCompleted = isCompletedOnDate(habit, date);
                    const isToday = date.toDateString() === new Date().toDateString();
                    
                    return (
                      <div key={idx} className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          {date.toLocaleDateString('ru-RU', { weekday: 'short' })}
                        </div>
                        <button
                          onClick={() => isToday && toggleToday(habit.id)}
                          disabled={!isToday}
                          className={`
                            w-full aspect-square rounded-lg flex items-center justify-center transition-all
                            ${isCompleted 
                              ? 'bg-green-500 text-white' 
                              : isToday 
                                ? 'bg-gray-100 hover:bg-gray-200 border-2 border-purple-500' 
                                : 'bg-gray-50 border border-gray-200'
                            }
                            ${isToday && !isCompleted ? 'cursor-pointer' : ''}
                            ${!isToday ? 'cursor-default' : ''}
                          `}
                        >
                          {isCompleted && <Check className="w-5 h-5" />}
                        </button>
                        <div className="text-xs text-gray-400 mt-1">
                          {date.getDate()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Кнопка отметки сегодня */}
                <button
                  onClick={() => toggleToday(habit.id)}
                  className={`
                    w-full mt-4 py-3 rounded-lg font-medium transition-all
                    ${isCompletedToday(habit)
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                    }
                  `}
                >
                  {isCompletedToday(habit) ? '✓ Выполнено сегодня' : 'Отметить выполнение'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Статистика */}
        {habits.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Общая статистика
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{habits.length}</div>
                <div className="text-sm text-gray-600 mt-1">Привычек</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {habits.filter(h => isCompletedToday(h)).length}
                </div>
                <div className="text-sm text-gray-600 mt-1">Выполнено сегодня</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">
                  {Math.max(...habits.map(h => getStreak(h)), 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Лучшая серия</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

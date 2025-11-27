import api from '../../api';

export function searchFoods(q) {
  const params = q ? { search: q } : undefined;
  return api.get('/api/nutrition/foods/', { params });
}

export function createFood(data) {
  return api.post('/api/nutrition/foods/', data);
}

export function getMeals(date) {
  return api.get('/api/nutrition/meals/', { params: { date } });
}

export function saveMeal(payload) {
  return api.post('/api/nutrition/meals/save/', payload);
}

export function getSummary(date) {
  return api.get('/api/nutrition/summary/', { params: { date } });
}export function deleteMeal(id) {
  return api.delete(`/api/nutrition/meals/${id}/`);
}

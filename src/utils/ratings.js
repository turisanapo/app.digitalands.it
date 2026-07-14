import { supabase } from '../lib/supabase';

// One query for a whole list of cards instead of one per card
export async function fetchRatingsMap(entityType, ids) {
    if (!ids.length) return {};
    const { data, error } = await supabase
        .from('reviews')
        .select('entity_id, rating')
        .eq('entity_type', entityType)
        .in('entity_id', ids.map(String));

    if (error || !data) return {};

    const map = {};
    for (const { entity_id, rating } of data) {
        const entry = map[entity_id] || (map[entity_id] = { sum: 0, count: 0 });
        entry.sum += rating;
        entry.count += 1;
    }
    for (const id of Object.keys(map)) {
        map[id] = { avg: map[id].sum / map[id].count, count: map[id].count };
    }
    return map;
}

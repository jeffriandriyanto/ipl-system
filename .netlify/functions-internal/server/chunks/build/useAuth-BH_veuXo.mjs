import { M as useState, N as navigateTo, O as useRuntimeConfig } from '../virtual/entry.mjs';
import { computed } from 'vue';
import { createClient } from '@supabase/supabase-js';

//#region app/composables/useSupabase.ts
var supabase = null;
var useSupabase = () => {
	if (!supabase) {
		const config = useRuntimeConfig();
		supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey);
	}
	return supabase;
};
var useSupabaseUser = () => {
	return useState("supabase-user", () => null);
};
//#endregion
//#region app/composables/useAuth.ts
var useAuth = () => {
	const user = useSupabaseUser();
	const supabase = useSupabase();
	const login = async (email, password) => {
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		if (error) throw error;
		user.value = data.user;
		return data;
	};
	const logout = async () => {
		await supabase.auth.signOut();
		user.value = null;
		await navigateTo("/login");
	};
	const isAuthenticated = computed(() => !!user.value);
	const checkSession = async () => {
		const { data: { session } } = await supabase.auth.getSession();
		if (session) user.value = session.user;
		return !!session;
	};
	return {
		user,
		login,
		logout,
		isAuthenticated,
		checkSession
	};
};

export { useAuth as u };
//# sourceMappingURL=useAuth-BH_veuXo.mjs.map

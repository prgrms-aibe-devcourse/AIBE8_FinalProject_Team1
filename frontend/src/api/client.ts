import axios from "axios"

// 서버 요청은 모두 이 인스턴스로 보낸다. 컴포넌트에서 axios를 직접 쓰지 않는다 (CONVENTION.md Frontend 규칙).
// 로그인을 만들 때 여기에 인터셉터를 붙인다: 요청에는 토큰을 넣고, 401 응답이면 토큰을 다시 받는다
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

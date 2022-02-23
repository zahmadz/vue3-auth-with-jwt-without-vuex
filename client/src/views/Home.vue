<template>
  <div class="home">
    <form @submit.prevent="handleLogin">
      <input type="text" v-model="email" placeholder="email" />
      <input type="text" v-model="password" placeholder="password" />
      <button>login</button>
    </form>
  </div>
</template>

<script>
// @ is an alias to /src
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Home',
  setup() {
    const email = ref('');
    const password = ref('');
    const router = useRouter();

    async function handleLogin() {
      const requestLogin = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value,
        }),
      });

      const responseLogin = await requestLogin.json();

      if (responseLogin.status !== 'ok') {
        alert(responseLogin.message);
      } else {
        alert('login success');
        router.go({ name: 'About' });
      }
    }

    return { email, password, handleLogin };
  },
};
</script>

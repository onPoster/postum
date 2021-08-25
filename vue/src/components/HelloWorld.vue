<template>
   <div>
     <h2> Filter LearnVue Articles </h2>
     <input 
      type='text' 
      placeholder='Filter Search' 
      v-model='query'
    />
    {{ query }}
   </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const query = ref('')
    return {
      query
    }
  }
}
</script>

<script lang="ts">
    export let message: App.Message;
</script>
  
<div class="flex w-full mt-2 space-x-3 max-w-xs {message.isMine ? 'ml-auto justify-end' : ''}">
    <div class=" p-3 {message.isMine ? 'bg-blue-600' : 'bg-gray-300'} {message.isMine ? 'rounded-l-lg rounded-br-lg' : 'rounded-r-lg rounded-bl-lg'}">
        <p class="text-sm {message.isMine ? 'text-white' : 'text-black'}">{message.text}</p>
    </div>
</div>
  
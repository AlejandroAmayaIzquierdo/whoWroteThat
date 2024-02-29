<script lang="ts">
	import Avatar from "./Avatar.svelte";

    export let user: App.UserInGame;
</script>


<li class="pb-3 sm:pb-4">
    <div class="flex items-center space-x-4 rtl:space-x-reverse">
       <div class="flex-shrink-0">
            <Avatar {user} />
       </div>
       <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
             {user.profileName ?? user.userName ?? user.userId ?? ''}
          </p>
       </div>
       <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          {user.roundData.score ?? 0} points
       </div>
    </div>
 </li>
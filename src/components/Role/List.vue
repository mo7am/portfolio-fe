<script setup lang="ts">
import Lucide from "@/base-components/Lucide/Lucide.vue";

const props = defineProps({
  roles: {
    type: Array<any>,
    default: [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  isMerchant: {
    type: Boolean,
    default: false,
  },
});

const getUserChars = (name: string) => {
  const names = name.split(" ");

  return names.length > 1 ? names[0][0] + " " + names[1][0] : names[0][0];
};
</script>
<template>
  <div>
    <div
      class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
      :class="{
        'opacity-70': isLoading,
      }"
    >
      <div
        class="p-4 flex flex-col gap-4 rounded bg-white shadow-lg"
        v-for="role in props.roles"
        :key="role.id"
      >
        <div class="flex items-center gap-4" v-if="role?.users?.length">
          <p>Total {{ role.users.length }} Users</p>
          <div class="flex">
            <div class="v-avatar-group">
              <template v-for="(user, index) in role?.users" :key="user">
                <VAvatar
                  color="primary"
                  size="36"
                  class="uppercase cursor-pointer mr-2"
                  :image="user?.avatar ? user?.avatar : undefined"
                  v-if="index <= 3"
                >
                  {{ getUserChars(user?.name) }}
                </VAvatar>
              </template>
              <VAvatar v-if="role.users.length > 4" color="#4A5072">
                <span> +{{ role.users.length - 4 }} </span>
              </VAvatar>
            </div>
          </div>
        </div>
        <div v-else>No Users available!</div>
        <div>
          <h1 class="text-lg font-medium">{{ role.name }}</h1>
          <div class="flex gap-2">
            <RouterLink
              v-if="!props.isMerchant"
              class="flex items-center gap-1 mt-1"
              :to="`/admin/roles/edit/${role.id}`"
            >
              <Lucide icon="Edit" class="w-4 h-4" />
              Edit
            </RouterLink>
            <button
              v-else
              class="flex items-center gap-1 mt-1"
              type="button"
              @click="$emit('callOpenEditPopup', role.id)"
            >
              <Lucide icon="Edit" class="w-4 h-4" />
              Edit
            </button>

            <button
              class="flex items-center gap-1 mt-1 text-danger"
              type="button"
              @click="$emit('callOnDeleteClick', role.id)"
            >
              <Lucide icon="Trash2" class="w-4 h-4 text-danger" />
              Delete
            </button>
            <VSpacer />
            <VBtn
              @click="$emit('callOpenClonePopup', role.id)"
              v-if="props.isMerchant"
              icon
              color="disabled"
              variant="text"
              size="x-small"
            >
              <VIcon size="24" icon="tabler-copy" />
            </VBtn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

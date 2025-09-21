<script setup lang="ts">
import { useUserStore } from "../../stores/user";

const router = useRouter();
const userStore = useUserStore();
const user = userStore.getUser;
const tenant = userStore.getTenant;
const api = inject<any>("api");

const hasMultipleTenants =
  userStore.getUser?.merchants_count > 1 ? true : false;

const logout = () => {
  try {
    const response = api.auth.logout();

    userStore.logOut();
    if (user.type == "admin") {
      router.push("/admin/login");
    } else {
      router.push("/login");
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      v-can="'view-modifier'"
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <Avatar v-if="!user.avatar" v-bind:initials="user?.name" />
      <VImg v-else :src="user.avatar" />

      <!-- SECTION Menu -->
      <VMenu activator="parent" width="230" location="bottom end" offset="14px">
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar color="primary" variant="tonal">
                    <Avatar v-if="!user.avatar" v-bind:initials="user?.name" />
                    <VImg v-else :src="user.avatar" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ user.name }}
            </VListItemTitle>
            <VListItemSubtitle>{{ user.type }}</VListItemSubtitle>
          </VListItem>

          <hr class="my-2" />

          <!-- 👉 Tenant -->
          <VListItem
            link
            v-if="tenant?.business_name && user.type == 'operator'"
          >
            <template #prepend>
              <VIcon class="me-2" icon="tabler-building" size="22" />
            </template>

            <VListItemTitle v-if="!hasMultipleTenants" class="w-20 truncate">{{
              tenant?.business_name
            }}</VListItemTitle>
            <RouterLink
              v-else
              class="ms-2 mb-1 w-20 truncate"
              :to="{ name: 'tenants' }"
            >
              {{ tenant?.business_name }}
            </RouterLink>
          </VListItem>

          <hr
            class="my-2"
            v-if="tenant?.business_name && user.type == 'operator'"
          />

          <!-- 👉 Emulation -->
          <VListItem
            link
            v-if="userStore.getIsEmulation"
            @ckick="userStore.setIsEmulation(0)"
          >
            <template #prepend>
              <VIcon class="me-2" icon="tabler-home" size="22" />
            </template>

            <RouterLink class="truncate" :to="{ name: 'admin-dashboard' }">
              Admin Dashboard
            </RouterLink>
          </VListItem>

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-user" size="22" />
            </template>

            <VListItemTitle>Profile</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem link>
            <template #prepend>
              <VIcon class="me-2" icon="tabler-settings" size="22" />
            </template>

            <VListItemTitle>
              <RouterLink
                v-if="user.type == 'merchant'"
                class="mb-1 w-20 truncate"
                :to="{ name: 'dashboard-inventory-settings' }"
              >
                Settings
              </RouterLink>
              <RouterLink v-else class="mb-1 w-20 truncate" :to="''">
                Settings
              </RouterLink>
            </VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <hr class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="logout">
            <template #prepend>
              <VIcon class="me-2" icon="tabler-logout" size="22" />
            </template>

            <VListItemTitle>Logout</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue"; // Added onMounted and ref
import { Modal } from "flowbite";
import type { ModalInterface, ModalOptions } from "flowbite"; // Optional: Import Flowbite types for better type safety

let modalInstance: ModalInterface | null = null;

const form = reactive({
  sex: "male",
  age: 4,
  ins_period: "1",
  ins_period_n_year_or_to_age: 3,
  payment_period: "1",
  payment_period_n_year_or_to_age: 2,
  sa: 1000,
  cash_bonus_type: "3",
  cash_bonus: "",
  cash_bonus_every: "",
  cash_bonus_to_age: "",
  matuarity: 202,
  entry_age: 60,
  premium: 971,
});

const ageLoop = ref(5);
const premiumForm = reactive<Record<number, number>>({});
const cashBonusForm = reactive<Record<number, number>>({});

onMounted(() => {
  const targetEl = document.getElementById("modalEl");
  if (targetEl) {
    const options: ModalOptions = {
      // placement: 'bottom-right',
      // backdrop: 'dynamic',
      // backdropClasses: 'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      // closable: true,
    };
    modalInstance = new Modal(targetEl, options);
  } else {
    console.warn(
      "Modal element with ID 'modalEl' not found. Ensure it's present in your template."
    );
  }

  for (let index = 0; index < ageLoop.value; index++) {
    premiumForm[index] = form.premium;
    cashBonusForm[index] = index == 2 ? 2 : 0;
  }
});

const calculation = () => {
  console.log(form, premiumForm);
  modalInstance?.show();
};

const isPaidPremium = (yearIndex: number) => {
    const paymentPeriod = parseInt(form.payment_period_n_year_or_to_age.toString())
    return paymentPeriod > yearIndex;
}

const paidPremium = (yearIndex: number) => {
    const premium = premiumForm[yearIndex] ?? 0;
    return premium
}

const cashBonusRate = (yearIndex: number) => {
    const cashBonusRate = cashBonusForm[yearIndex] ?? 0;
    return cashBonusRate
}

const cashBonusReceive = (yearIndex: number) => {
    const rate = cashBonusRate(yearIndex);
    return rate ? parseInt(form.sa.toString()) * (rate / 100) : 0;
}

const matuarity = (yearIndex: number) => {
    const isLast = parseInt(form.ins_period_n_year_or_to_age.toString()) == yearIndex;
    return isLast ? parseInt(form.sa.toString()) * (form.matuarity / 100) : 0;
}

const cashFlow = (yearIndex: number) => {
    const isLast = parseInt(form.ins_period_n_year_or_to_age.toString()) == yearIndex;
    if (isLast) {
        return parseInt(form.sa.toString()) * (parseInt(form.matuarity.toString()) / 100);
    } else {
        const isPaid = isPaidPremium(yearIndex);
        if (isPaid) {
            return cashBonusReceive(yearIndex) - paidPremium(yearIndex);
        }
        return cashBonusReceive(yearIndex);
    }
}

</script>

<template>
  <form class="mx-auto" @submit.prevent="calculation">
    <div class="grid gap-6 mb-6 md:grid-cols-2">
      <div>
        <label for="sex" class="block mb-2 text-sm font-medium text-gray-900"
          >Sex :
        </label>
        <select
          id="sex"
          v-model="form.sex"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        >
          <option value="male" selected>Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div>
        <label for="age" class="block mb-2 text-sm font-medium text-gray-900"
          >Age :</label
        >
        <input
          type="number"
          id="age"
          v-model="form.age"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder=""
          min="0"
          required
        />
      </div>

      <div>
        <label
          for="ins_period"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Insurance Period :</label
        >
        <select
          id="ins_period"
          v-model="form.ins_period"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        >
          <option value="1" selected>N-Years</option>
          <option value="2">To Age</option>
        </select>
      </div>
      <div>
        <label
          for="ins_period_n_year_or_to_age"
          class="block mb-2 text-sm font-medium text-gray-900"
          >N-Years or To Age :</label
        >
        <input
          type="number"
          v-model="form.ins_period_n_year_or_to_age"
          id="ins_period_n_year_or_to_age"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder=""
          min="0"
          required
        />
      </div>

      <div>
        <label
          for="payment_period"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Payment Period :</label
        >
        <select
          id="payment_period"
          v-model="form.payment_period"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          required
        >
          <option value="1" selected>N-Years</option>
          <option value="2">To Age</option>
        </select>
      </div>
      <div>
        <label
          for="payment_period_n_year_or_to_age"
          class="block mb-2 text-sm font-medium text-gray-900"
          >N-Years or To Age :</label
        >
        <input
          type="number"
          id="payment_period_n_year_or_to_age"
          v-model="form.payment_period_n_year_or_to_age"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder=""
          min="0"
          required
        />
      </div>

      <div class="col-span-2">
        <label
          for="n_year_or_to_age"
          class="block mb-2 text-sm font-medium text-gray-900"
          >SA (Sum Assured) :</label
        >
        <input
          type="number"
          id="sa"
          v-model="form.sa"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder=""
          min="0"
          required
        />
      </div>

      <div>
        <label
          for="cash_bonus_type"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Cash Bonus Type :</label
        >
        <select
          id="cash_bonus_type"
          v-model="form.cash_bonus_type"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        >
          <option value="1" disabled>Cash Bonus every x years</option>
          <option value="2" disabled>Type 1 + to age</option>
          <option value="3" selected>Custom</option>
          <option value="4" disabled>None</option>
        </select>
      </div>
      <div>
        <label
          for="cash_bonus"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Cash Bonus :</label
        >
        <input
          type="number"
          id="cash_bonus"
          v-model="form.cash_bonus"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder=""
          min="0"
        />
      </div>
      <div>
        <label
          for="cash_bonus_every"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Cash Bonus Every :</label
        >
        <input
          type="number"
          id="cash_bonus_every"
          v-model="form.cash_bonus_every"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder=""
          min="0"
        />
      </div>
      <div>
        <label
          for="cash_bonus_to_age"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Cash Bonus To Age :</label
        >
        <input
          type="number"
          id="cash_bonus_to_age"
          v-model="form.cash_bonus_to_age"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder=""
          min="0"
        />
      </div>

      <div>
        <label
          for="matuarity"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Matuarity :</label
        >
        <input
          type="number"
          id="matuarity"
          v-model="form.matuarity"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder=""
          min="0"
          required
        />
      </div>

      <div>
        <label
          for="entry_age"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Entry Age :</label
        >
        <input
          type="number"
          id="entry_age"
          v-model="form.entry_age"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder=""
          min="0"
          required
        />
      </div>

      <div class="col-span-2">
        <label
          for="premium"
          class="block mb-2 text-sm font-medium text-gray-900"
          >Premium (insurance premium) :</label
        >
        <input
          type="number"
          id="premium"
          v-model="form.premium"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder=""
          min="0"
          required
        />
      </div>

      <div>
        <table class="w-full text-sm text-center">
          <thead class="text-xs text-white uppercase bg-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3" colspan="2">PREMIUM</th>
            </tr>
            <tr>
              <th scope="col" class="px-6 py-3">Age</th>
              <th scope="col" class="px-6 py-3">Male/Female</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="index in ageLoop"
              :key="index"
              class="bg-white border-b border-gray-200"
            >
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {{ index - 1 }}
              </th>
              <td class="px-6 py-4">
                <input
                  type="number"
                  v-model="premiumForm[index - 1]"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder=""
                  min="0"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <table class="w-full text-sm text-center">
          <thead class="text-xs text-white uppercase bg-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3" colspan="2">Cash Bonus</th>
            </tr>
            <tr>
              <th scope="col" class="px-6 py-3">Year</th>
              <th scope="col" class="px-6 py-3">%</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="index in ageLoop"
              :key="index"
              class="bg-white border-b border-gray-200"
            >
              <th
                scope="row"
                class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
              >
                {{ index - 1 }}
              </th>
              <td class="px-6 py-4">
                <input
                  type="number"
                  v-model="cashBonusForm[index - 1]"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  placeholder=""
                  min="0"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <button
      type="submit"
      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    >
      Submit
    </button>
  </form>

  <!-- Main modal -->
  <div
    id="modalEl"
    tabindex="-1"
    class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
  >
    <div class="relative w-full max-w-7xl max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
        <!-- Modal header -->
        <div
          class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200"
        >
          <h3 class="text-lg font-semibold text-white">
            IRR : xxxx
          </h3>
          <button
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm h-8 w-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
            data-modal-toggle="modalEl"
          >
            <svg
              class="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5">
          <div class="relative overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3">Age</th>
                  <th scope="col" class="px-6 py-3">Year</th>
                  <th scope="col" class="px-6 py-3">Premium</th>
                  <th scope="col" class="px-6 py-3">Cash Bonus Rate</th>
                  <th scope="col" class="px-6 py-3">Cash Bonus</th>
                  <th scope="col" class="px-6 py-3">Mat</th>
                  <th scope="col" class="px-6 py-3">CF</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="bg-white border-b border-gray-200"
                  v-for="yearIndex in parseInt(form.age)"
                  :key="yearIndex"
                >
                  <th
                    scope="row"
                    class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {{ yearIndex - 1 }}
                  </th>
                  <td class="px-6 py-4">{{ yearIndex - 1 }}</td>
                  <td class="px-6 py-4">
                    <span v-if="isPaidPremium(yearIndex - 1)">{{ form.premium }}</span></td>
                  <td class="px-6 py-4">
                    <span>{{ cashBonusRate(yearIndex - 1) }}.00%</span>
                  </td>
                  <td class="px-6 py-4">
                    <span>{{ cashBonusReceive(yearIndex- 1).toFixed(2) }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <span>{{ matuarity(yearIndex- 1).toFixed(2) }}</span>
                  </td>
                    <td class="px-6 py-4">
                    <span>{{ cashFlow(yearIndex- 1).toFixed(2) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

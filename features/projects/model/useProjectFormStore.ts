import { create } from 'zustand';
export const initialProjectFormValues = {
  title: "",
  description: "",
  userId: "",
  availableDays: [],
  availableDates: [],
  availableStartTime: new Date(),
  availableEndTime: new Date(),
  dateMode: "single",
  durationHours: null as number | null,
  isPaid: false,
  pricePerHour: null,
  latitude: null,
  longitude: null,
  locationAddress: "",
  inputLocation: "",
  deviceSource: "no_preference",
  pinDisplay: "bubble",
  recruitType: "photographer",
  requestNote: "thanks",
  projectCategories: [] as string[],
  projectDevices: [] as string[],
};

interface ProjectFormState {
  form: typeof initialProjectFormValues;
  setField: <K extends keyof typeof initialProjectFormValues>(
    key: K,
    value: typeof initialProjectFormValues[K]
  ) => void;
  resetForm: () => void;
}

export const useProjectFormStore = create<ProjectFormState>((set) => ({
  form: { ...initialProjectFormValues },
  setField: (key, value) =>
    set((state) => ({
      form: {
        ...state.form,
        [key]: value,
      },
    })),
  resetForm: () =>
    set(() => ({
      form: { ...initialProjectFormValues },
    })),
}));

import { create } from 'zustand';

interface Store {
  isPost2023: boolean;
  setIsPost2023: React.Dispatch<React.SetStateAction<boolean>>;

  underGradBalance: number;
  setUnderGradBalance: React.Dispatch<React.SetStateAction<number>>;

  postGradBalance: number;
  setPostGradBalance: React.Dispatch<React.SetStateAction<number>>;

  plan2LTRate: number;
  setPlan2LTRate: React.Dispatch<React.SetStateAction<number>>;

  plan2UTRate: number;
  setPlan2UTRate: React.Dispatch<React.SetStateAction<number>>;

  plan5Rate: number;
  setPlan5Rate: React.Dispatch<React.SetStateAction<number>>;

  postGradRate: number;
  setPostGradRate: React.Dispatch<React.SetStateAction<number>>;

  inflationRate: number;
  setInflationRate: React.Dispatch<React.SetStateAction<number>>;

  repaymentDate: Date | null;
  setRepaymentDate: React.Dispatch<React.SetStateAction<Date | null>>;

  salary: number;
  setSalary: React.Dispatch<React.SetStateAction<number>>;
}

export const useStore = create<Store>((set) => ({
  isPost2023: false,
  setIsPost2023: (change) =>
    set((state) => ({
      isPost2023:
        typeof change === 'function' ? change(state.isPost2023) : change,
    })),

  underGradBalance: 50_000,
  setUnderGradBalance: (change) =>
    set((state) => ({
      underGradBalance:
        typeof change === 'function' ? change(state.underGradBalance) : change,
    })),

  postGradBalance: 0,
  setPostGradBalance: (change) =>
    set((state) => ({
      postGradBalance:
        typeof change === 'function' ? change(state.postGradBalance) : change,
    })),

  plan2LTRate: 6.5,
  setPlan2LTRate: (change) =>
    set((state) => ({
      plan2LTRate:
        typeof change === 'function' ? change(state.plan2LTRate) : change,
    })),

  plan2UTRate: 6.5,
  setPlan2UTRate: (change) =>
    set((state) => ({
      plan2UTRate:
        typeof change === 'function' ? change(state.plan2UTRate) : change,
    })),

  plan5Rate: 6.5,
  setPlan5Rate: (change) =>
    set((state) => ({
      plan5Rate:
        typeof change === 'function' ? change(state.plan5Rate) : change,
    })),

  postGradRate: 6.5,
  setPostGradRate: (change) =>
    set((state) => ({
      postGradRate:
        typeof change === 'function' ? change(state.postGradRate) : change,
    })),

  inflationRate: 0,
  setInflationRate: (change) =>
    set((state) => ({
      inflationRate:
        typeof change === 'function' ? change(state.inflationRate) : change,
    })),

  repaymentDate: new Date() as Date | null,
  setRepaymentDate: (change) =>
    set((state) => ({
      repaymentDate:
        typeof change === 'function' ? change(state.repaymentDate) : change,
    })),

  salary: 0,
  setSalary: (change) =>
    set((state) => ({
      salary: typeof change === 'function' ? change(state.salary) : change,
    })),
}));

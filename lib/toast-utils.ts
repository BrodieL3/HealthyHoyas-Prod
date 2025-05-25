import { toast } from "sonner";

export interface ToastOptions {
  duration?: number;
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "top-center"
    | "bottom-center";
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Success toasts for data entry
export const dataEntryToasts = {
  // Food logging
  foodLogged: (foodName?: string) => {
    return toast.success(
      `${foodName ? `${foodName} ` : "Food "}logged successfully!`,
      {
        duration: 3000,
      }
    );
  },

  mealSaved: (mealType?: string) => {
    return toast.success(
      `${mealType ? `${mealType} ` : "Meal "}saved successfully!`,
      {
        duration: 3000,
      }
    );
  },

  // Weight tracking
  weightLogged: (weight?: number) => {
    return toast.success(
      `Weight ${weight ? `(${weight} lbs) ` : ""}logged successfully!`,
      {
        duration: 3000,
      }
    );
  },

  // Sleep tracking
  sleepLogged: (hours?: number) => {
    return toast.success(
      `Sleep ${hours ? `(${hours} hours) ` : ""}logged successfully!`,
      {
        duration: 3000,
      }
    );
  },

  // Settings
  settingsSaved: () => {
    return toast.success("Settings saved successfully!", {
      duration: 3000,
    });
  },

  profileUpdated: () => {
    return toast.success("Profile updated successfully!", {
      duration: 3000,
    });
  },

  // Custom food items
  customFoodCreated: (foodName?: string) => {
    return toast.success(
      `${foodName ? `${foodName} ` : "Custom food "}created successfully!`,
      {
        duration: 3000,
      }
    );
  },

  // Data deletion
  dataDeleted: (itemType?: string) => {
    return toast.success(
      `${itemType ? `${itemType} ` : "Item "}deleted successfully!`,
      {
        duration: 2000,
      }
    );
  },

  // Data updates
  dataUpdated: (itemType?: string) => {
    return toast.success(
      `${itemType ? `${itemType} ` : "Item "}updated successfully!`,
      {
        duration: 3000,
      }
    );
  },
};

// Error toasts
export const errorToasts = {
  // Generic errors
  generic: (message?: string) => {
    return toast.error(message || "Something went wrong. Please try again.", {
      duration: 4000,
    });
  },

  // Network errors
  network: () => {
    return toast.error(
      "Network error. Please check your connection and try again.",
      {
        duration: 4000,
      }
    );
  },

  // Validation errors
  validation: (message: string) => {
    return toast.error(message, {
      duration: 4000,
    });
  },

  // Authentication errors
  auth: () => {
    return toast.error("Please sign in to continue.", {
      duration: 4000,
    });
  },

  // Permission errors
  permission: () => {
    return toast.error("You don't have permission to perform this action.", {
      duration: 4000,
    });
  },

  // Data entry specific errors
  foodNotFound: () => {
    return toast.error("Food item not found. Please try a different search.", {
      duration: 4000,
    });
  },

  invalidWeight: () => {
    return toast.error("Please enter a valid weight value.", {
      duration: 4000,
    });
  },

  invalidSleep: () => {
    return toast.error("Please enter a valid sleep duration.", {
      duration: 4000,
    });
  },

  saveFailed: (itemType?: string) => {
    return toast.error(
      `Failed to save ${itemType || "data"}. Please try again.`,
      {
        duration: 4000,
      }
    );
  },

  deleteFailed: (itemType?: string) => {
    return toast.error(
      `Failed to delete ${itemType || "item"}. Please try again.`,
      {
        duration: 4000,
      }
    );
  },
};

// Loading toasts
export const loadingToasts = {
  saving: (itemType?: string) => {
    return toast.loading(`Saving ${itemType || "data"}...`);
  },

  loading: (itemType?: string) => {
    return toast.loading(`Loading ${itemType || "data"}...`);
  },

  deleting: (itemType?: string) => {
    return toast.loading(`Deleting ${itemType || "item"}...`);
  },
};

// Info toasts
export const infoToasts = {
  tip: (message: string) => {
    return toast.info(message, {
      duration: 5000,
    });
  },

  reminder: (message: string) => {
    return toast.info(message, {
      duration: 4000,
    });
  },

  welcome: (userName?: string) => {
    return toast.info(
      `Welcome${
        userName ? `, ${userName}` : ""
      }! Start tracking your health journey.`,
      {
        duration: 4000,
      }
    );
  },
};

// Warning toasts
export const warningToasts = {
  unsavedChanges: () => {
    return toast.warning(
      "You have unsaved changes. Are you sure you want to leave?",
      {
        duration: 5000,
      }
    );
  },

  dataLimit: (limit: string) => {
    return toast.warning(`You've reached the ${limit} limit.`, {
      duration: 4000,
    });
  },

  lowData: (dataType: string) => {
    return toast.warning(`Your ${dataType} data seems incomplete.`, {
      duration: 4000,
    });
  },
};

// Utility functions
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

export const dismissAllToasts = () => {
  toast.dismiss();
};

// Promise-based toast for async operations
export const promiseToast = <T>(
  promise: Promise<T>,
  {
    loading,
    success,
    error,
  }: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
): Promise<T> => {
  toast.promise(promise, {
    loading,
    success,
    error,
  });
  return promise;
};

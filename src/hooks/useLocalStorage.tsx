
import { useState } from "react";

export default function useLocalStorage(keyName: string, defaultValue: object | null) {
          const getStoredData = () => {
                    try {
                              const value = window.localStorage.getItem(keyName);
                              if (value) {
                                        return JSON.parse(value);
                              } else {
                                        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
                                        return defaultValue;
                              }
                    } catch (err) {
                              return defaultValue;
                    }
          }
          const [storedValue, setStoredValue] = useState(getStoredData);
          const setValue = (newValue: string) => {
                    try {
                              window.localStorage.setItem(keyName, JSON.stringify(newValue));
                    } catch (err) {
                              console.log(err);
                    }
                    setStoredValue(newValue);
          };

          return [storedValue, setValue];
};
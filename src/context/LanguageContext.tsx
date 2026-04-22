'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'EN' | 'RU';

/* ─── Translation dictionary ─────────────────────────────────────────────── */
export const T = {
  /* ── Nav ── */
  nav_home:    { EN: 'Home',    RU: 'Главная'  },
  nav_product: { EN: 'Product', RU: 'Продукт'  },

  /* ── Hero ── */
  hero_tagline: { EN: 'The Silence of Absolute Stability.', RU: 'Тишина абсолютной стабильности.' },
  hero_explore: { EN: 'Explore',                            RU: 'Смотреть'                       },
  hero_est:     { EN: 'EST. 2026',                          RU: 'ОСН. 2026'                      },

  /* ── Product Hero ── */
  ph_label:    { EN: 'CryoStasis© — Product 001',           RU: 'CryoStasis© — Продукт 001'      },
  ph_subtitle: { EN: 'Cryogenic transport case for\nhuman organ preservation.\nRated to −196 °C.',
                 RU:  'Криогенный контейнер для\nтранспортировки органов.\nДо −196 °C.'         },
  ph_scroll:   { EN: 'Scroll',                              RU: 'Прокрутка'                        },
  ph_temp:     { EN: 'Temperature',                         RU: 'Температура'                    },
  ph_battery:  { EN: 'Battery',                             RU: 'Аккумулятор'                        },
  ph_weight:   { EN: 'Weight',                              RU: 'Масса'                            },
  ph_material: { EN: 'Material',                            RU: 'Материал'                       },
  ph_cooling:  { EN: 'Cooling Mode',                        RU: 'Режим охлаждения'               },

  /* ── Gallery ── */
  gallery_label:   { EN: '01 — Gallery',         RU: '01 — Галерея'           },
  gallery_heading: { EN: 'Form follows function.', RU: 'Форма следует функции.' },
  gallery_note:    { EN: 'All renders generated from validated CAD model P023782B.',
                     RU:  'Все рендеры созданы на основе валидированной CAD-модели P023782B.' },
  img_iso:     { EN: 'Full isometric view',  RU: 'Изометрия в сборе'    },
  img_int:     { EN: 'Interior cavity',      RU: 'Внутренняя камера'    },
  img_handle:  { EN: 'Handle & labeling',    RU: 'Рукоятка и маркировка'  },
  img_display: { EN: 'Status display',       RU: 'Дисплей состояния'       },

  /* ── Specs ── */
  specs_label:   { EN: '02 — Technical Specifications', RU: '02 — Технические характеристики' },
  specs_heading: { EN: 'Engineered to the last decimal.', RU: 'Рассчитан до тысячных долей.' },
  specs_note:    { EN: 'Specifications subject to change. All measurements taken under standard laboratory conditions (20 °C, 50% RH).\nCryoStasis© reserves the right to modify product specifications without prior notice.',
                   RU:  'Характеристики могут быть изменены. Все измерения проведены при стандартных лабораторных условиях (20 °C, 50% отн. вл.).\nCryoStasis© оставляет за собой право изменять спецификации без предварительного уведомления.' },
  specs_thermal:      { EN: 'Thermal',      RU: 'Термальный'    },
  specs_power:        { EN: 'Power',        RU: 'Питание'       },
  specs_physical:     { EN: 'Physical',     RU: 'Физический'    },
  specs_materials:    { EN: 'Materials',    RU: 'Материалы'     },
  specs_electronics:  { EN: 'Electronics',  RU: 'Электроника'   },
  specs_compliance:   { EN: 'Compliance',   RU: 'Сертификация'  },
  specs_op_temp:      { EN: 'Operating Temperature',   RU: 'Рабочая температура'      },
  specs_cooling_mode: { EN: 'Cooling Mode',             RU: 'Режим охлаждения'         },
  specs_stability:    { EN: 'Thermal Stability',        RU: 'Термальная стабильность'  },
  specs_batt_cap:     { EN: 'Battery Capacity',         RU: 'Ёмкость аккумулятора'    },
  specs_batt_life:    { EN: 'Battery Life',             RU: 'Время работы'             },
  specs_ac:           { EN: 'AC Input',                 RU: 'Питание от сети'          },
  specs_dims:         { EN: 'Exterior Dimensions',      RU: 'Внешние габариты'         },
  specs_volume:       { EN: 'Interior Volume',          RU: 'Внутренний объём'         },
  specs_net_weight:   { EN: 'Net Weight',               RU: 'Масса нетто'              },
  specs_shell:        { EN: 'Outer Shell',              RU: 'Внешняя оболочка'         },
  specs_insulation:   { EN: 'Insulation Layer',         RU: 'Слой изоляции'            },
  specs_inner:        { EN: 'Inner Chamber',            RU: 'Внутренняя камера'        },
  specs_display:      { EN: 'Display',                  RU: 'Дисплей'                  },
  specs_conn:         { EN: 'Connectivity',             RU: 'Связь'                    },
  specs_sensors:      { EN: 'Sensors',                  RU: 'Датчики'                  },
  specs_med_cert:     { EN: 'Medical Certification',    RU: 'Медицинская сертификация' },
  specs_transport:    { EN: 'Transport Classification', RU: 'Транспортная классификация'},
  specs_regulatory:   { EN: 'Regulatory',               RU: 'Нормативная база'         },

  /* ── Teardown ── */
  teardown_label:   { EN: '03 — Material Composition',  RU: '03 — Состав материалов'     },
  teardown_heading: { EN: 'Inside the Vinculum.',        RU: 'Внутри Vinculum.'           },
  teardown_layer:   { EN: 'Layer',                       RU: 'Слой'                       },
  layer_ins_title:  { EN: 'Insulation',                  RU: 'Термоизоляция'                   },
  layer_ins_sub:    { EN: 'Thermal architecture',        RU: 'Термальная архитектура'     },
  layer_ins_mat:    { EN: 'ABS — EPS — Stainless Steel', RU: 'ABS — EPS — Нержавеющая сталь' },
  layer_ins_desc:   { EN: 'Three-layer thermal barrier: an ABS outer shell for impact resistance, an EPS foam core for passive insulation, and a medical-grade stainless steel inner chamber that maintains cryogenic stability for up to 72 hours without active power.',
                      RU:  'Трёхслойный термический барьер: внешняя оболочка из ABS для защиты от ударов, сердечник из вспененного полистирола для пассивной изоляции и внутренняя камера из медицинской нержавеющей стали, обеспечивающая криогенную стабильность до 72 часов без активного питания.' },
  layer_hyg_title:  { EN: 'Hygiene',                    RU: 'Стерильность'                    },
  layer_hyg_sub:    { EN: 'Sterile contact surfaces',   RU: 'Стерильные контактные поверхности' },
  layer_hyg_mat:    { EN: 'Stainless Steel',            RU: 'Нержавеющая сталь'          },
  layer_hyg_desc:   { EN: 'All surfaces in contact with the organ container are fabricated from 316L medical-grade stainless steel. The perforated inner basket and removable lid are autoclavable, enabling full sterilisation between transport cycles.',
                      RU:  'Все поверхности, контактирующие с контейнером для органа, изготовлены из медицинской нержавеющей стали 316L. Перфорированная внутренняя корзина и съёмная крышка поддаются автоклавированию, обеспечивая полную стерилизацию между циклами транспортировки.' },
  layer_elec_title: { EN: 'Electronics',                RU: 'Электроника'                },
  layer_elec_sub:   { EN: 'Intelligent monitoring',     RU: 'Интеллектуальный мониторинг'},
  layer_elec_mat:   { EN: 'Composite Materials & Semiconductors',          RU: 'Композитные материалы и полупроводники'        },
  layer_elec_desc:  { EN: 'A custom controller PCB manages thermal regulation, sensor fusion, and wireless telemetry. The LiPo battery pack provides 72 hours of autonomous operation. A precision RTD temperature probe, humidity sensor, and 3-axis shock detector feed continuous data to the e-ink status display and cloud dashboard.',
                      RU:  'Специализированная плата управления обеспечивает терморегуляцию, слияние данных датчиков и беспроводную телеметрию. Аккумуляторный блок LiPo обеспечивает 72 часа автономной работы. Прецизионный температурный зонд RTD, датчик влажности и трёхосевой детектор ударов непрерывно передают данные на e-ink дисплей и в облачную панель управления.' },

  /* ── Purchase Panel ── */
  pp_label:       { EN: '04 — Acquire',              RU: '04 — Приобрести'          },
  pp_heading:     { EN: 'Configure your order.',     RU: 'Конфигурация заказа.'     },
  pp_brand:       { EN: 'CryoStasis© — Cryo-01',    RU: 'CryoStasis© — Cryo-01'   },
  pp_subtitle:    { EN: 'Cryogenic Organ Transport Case', RU: 'Криогенный контейнер для транспортировки органов' },
  pp_inbox:       { EN: 'In the box',                RU: 'В комплекте'              },
  pp_item1:       { EN: 'Vinculum transport case × 1', RU: 'Транспортный кейс Vinculum × 1' },
  pp_item2:       { EN: 'AC power cable (IEC C14) × 1', RU: 'Сетевой кабель (IEC C14) × 1' },
  pp_item3:       { EN: 'Temperature calibration certificate', RU: 'Сертификат калибровки температуры' },
  pp_item4:       { EN: 'Quick-start guide',         RU: 'Краткое руководство'      },
  pp_item5:       { EN: 'Sterile inner basket × 2',  RU: 'Стерильная внутренняя корзина × 2' },
  pp_unit_price:  { EN: 'Unit price',                RU: 'Цена за единицу'          },
  pp_usd:         { EN: 'USD / unit',                RU: 'USD / шт.'                },
  pp_volume:      { EN: 'Volume pricing available for orders of 5+', RU: 'Оптовые цены при заказе от 5 единиц' },
  pp_quantity:    { EN: 'Quantity',                  RU: 'Количество'               },
  pp_total:       { EN: 'Total',                     RU: 'Итого'                    },
  pp_add:         { EN: 'Add to cart',               RU: 'В корзину'               },
  pp_added:       { EN: '✓ Added to cart',           RU: '✓ Добавлено'             },
  pp_checkout:    { EN: 'Proceed to checkout',       RU: 'Перейти к оформлению'    },
  pp_quote:       { EN: 'Request quote',             RU: 'Запросить предложение'   },
  pp_lead:        { EN: 'Estimated lead time: 6–8 weeks from order confirmation.\nWorldwide shipping. Export compliance documentation included.',
                    RU:  'Расчетный срок поставки: 6–8 недель после подтверждения заказа.\nДоставка по всему миру. Экспортная документация включена в комплект.' },

  /* ── Cart ── */
  cart_label:       { EN: '00 — Cart',                 RU: '00 — Корзина'             },
  cart_empty_title: { EN: 'Nothing here.',              RU: 'Здесь пусто.'             },
  cart_your_order:  { EN: 'Your order.',                RU: 'Ваш заказ.'               },
  cart_empty_sub:   { EN: 'Nothing added yet.',         RU: 'Пока ничего не добавлено.'},
  cart_view:        { EN: 'View product',               RU: 'Смотреть продукт'         },
  cart_continue:    { EN: '← Continue shopping',        RU: '← Продолжить покупки'     },
  cart_summary:     { EN: 'Order Summary',              RU: 'Сводка заказа'            },
  cart_shipping:    { EN: 'Shipping',                   RU: 'Доставка'                 },
  cart_ship_calc:   { EN: 'Calculated at checkout',     RU: 'Рассчитывается при оформлении' },
  cart_checkout:    { EN: 'Proceed to Checkout',        RU: 'Перейти к оформлению'     },
  cart_quote:       { EN: 'Request Quote',              RU: 'Запросить предложение'    },
  cart_lead:        { EN: 'Lead time 6–8 weeks from confirmation.\nWorldwide shipping. Export docs included.',
                      RU:  'Производство 6–8 недель после подтверждения.\nДоставка по всему миру. Экспортные документы включены.' },

  /* ── Auth ── */
  auth_signin:     { EN: 'Sign In',         RU: 'Войти'           },
  auth_signup:     { EN: 'Sign Up',         RU: 'Регистрация'     },
  auth_welcome:    { EN: 'Welcome back.',   RU: 'С возвращением.' },
  auth_create:     { EN: 'Create account.', RU: 'Создать аккаунт.'},
  auth_login_lbl:  { EN: 'Login',           RU: 'Логин'           },
  auth_pass_lbl:   { EN: 'Password',        RU: 'Пароль'          },
  auth_confirm:    { EN: 'Confirm Password',RU: 'Подтвердите пароль'},
  auth_or:         { EN: 'or',              RU: 'или'             },
  auth_google:     { EN: 'Continue with Google', RU: 'Войти через Google' },
  auth_no_acc:     { EN: 'No account?',    RU: 'Нет аккаунта?'   },
  auth_have_acc:   { EN: 'Have an account?', RU: 'Есть аккаунт?'  },
  auth_signup_arr: { EN: 'Sign Up →',      RU: 'Регистрация →'   },
  auth_signin_arr: { EN: '← Sign In',      RU: '← Войти'         },

  /* ── Footer ── */
  footer_tagline:  { EN: 'Precision cryogenic transport engineering.\nAbsolute stability. Zero compromise.',
                     RU:  'Точная инженерия криогенного транспорта.\nАбсолютная стабильность. Никаких компромиссов.' },
  footer_nav:      { EN: 'Navigation',   RU: 'Навигация'   },
  footer_socials:  { EN: 'Socials',      RU: 'Соцсети'     },
  footer_email:    { EN: 'Email',        RU: 'Почта'       },
  footer_rights:   { EN: '© 2026 CryoStasis©. All rights reserved.', RU: '© 2026 CryoStasis©. Все права защищены.' },
  footer_privacy:  { EN: 'Privacy',      RU: 'Конфиденциальность' },
  footer_terms:    { EN: 'Terms',        RU: 'Условия'     },
  footer_home:     { EN: 'Home',         RU: 'Главная'     },
  footer_product:  { EN: 'Product',      RU: 'Продукт'     },
  footer_cart:     { EN: 'Cart',         RU: 'Корзина'     },
  footer_auth:     { EN: 'Auth',         RU: 'Войти'       },
} as const;

type TKey = keyof typeof T;

/* ─── Context ─────────────────────────────────────────────────────────────── */
interface LangCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: TKey) => string;
}

const LanguageContext = createContext<LangCtx>({
  lang: 'EN',
  setLang: () => {},
  t: (key) => T[key].EN,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('EN');
  const t = (key: TKey): string => T[key][lang];
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

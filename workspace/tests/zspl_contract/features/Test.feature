Тест: Реестр договоров

        Предыстория:
            Дано Я запустил приложение с семантическим объектом #zspl_contract-display

        Сценарий: Проверка наименований колонок

             Когда на странице Реестр Я проверил список колонок в реестре
                  | ID договора            |
                  | Действует с            |
                  | Действует по           |
                  | № договора поставщика  |
                  | № договора             |
                  | Предмет договора       |
                  | Исполнение по договору |
                  | Заключено на уровне    |

             Когда на странице Реестр Я нажал на кнопку c иконкой
                  | иконка | action-settings |

             Когда на странице Реестр Я проверил список всех доступных колонок в настройках
                  | ID договора                           |
                  | Действует с                           |
                  | Действует по                          |
                  | № договора поставщика                 |
                  | № договора                            |
                  | Предмет договора                      |
                  | Исполнение по договору                |
                  | Заключено на уровне                   |
                  | Валюта                                |
                  | Выполнено, без НДС                    |
                  | Дата заключения договора              |
                  | Заключено на уровне(Закуп.Орг.): ID   |
                  | Код валюты                            |
                  | Краткий текст дробной части валюты    |
                  | Оплаченных УПД, без НДС               |
                  | Остаток по договору, без НДС          |
                  | Ответственный за договор от банка: ID |
                  | Подтвержденных актов, без НДС         |
                  | Сумма договора, без НДС               |
                  | Сформированных актов, без НДС         |
                  | Сформированных УПД, без НДС           |
                  | Тел                                   |
                  | Тип договора                          |
                  | ФИО                                   |
                  | E-mail                                |
                  | ID банковских данных                  |
                  | ID договора УВХД                      |

             Когда на странице Реестр Я нажал на кнопку
                  | текст  | Отменить |
                  | диалог | Да       |


        Сценарий: Проверка данных и поиска

             Когда на странице Реестр Я нажал на вкладку
                  | вкладка | Архив |
            
             Когда на странице Реестр Я проверил данные в реестре
                  | ID договора | Действует с | Действует по | № договора поставщика     | № договора    | Предмет договора                                    | Заключено на уровне |
                  | 4600000014  | 25.09.2019  | 30.09.2019   | НОМЕР ДОГОВОРА ПОСТАВЩИКА | ДОГОВОР №126  | Архив. Договор на техническую эксплуатацию и уборку | ЦА Сбербанк         |
                  | 4600000030  | 15.10.2019  | 31.12.2030   |                           | SM-1355       | Оказание услуг клининга                             | ЦА Сбербанк         |
                  | 4600000033  | 17.10.2019  | 31.12.2030   |                           | VN50000001536 |                                                     | ЦА Сбербанк         |
                  | 4600000055  | 01.08.2017  | 31.08.2020   |                           | 91111_11      | testtestjj9                                         | Байкальский банк    |

             Когда на странице Реестр Я раскрыл заголовок

             Когда на странице Реестр Я указал значение для поиска
                  | текст | 460000003* |

             Когда на странице Реестр Я проверил данные в реестре
                  | ID договора | Действует с | Действует по | № договора поставщика | № договора    | Предмет договора        | Заключено на уровне |
                  | 4600000030  | 15.10.2019  | 31.12.2030   |                       | SM-1355       | Оказание услуг клининга | ЦА Сбербанк         |
                  | 4600000033  | 17.10.2019  | 31.12.2030   |                       | VN50000001536 |                         | ЦА Сбербанк         |

             Когда на странице Реестр Я нажал на вкладку
                  | вкладка | Действующие |

             Когда на странице Реестр Я проверил данные в реестре
                  | ID договора | Действует с | Действует по | № договора поставщика | № договора               | Предмет договора   | Заключено на уровне |
                  | 4600000034  | 17.10.2019  | 01.01.2020   | ДОГОВОР №123          | ДОГОВОР НА КЛИНИНИНГ 234 | Клининговые услуги | ЦА Сбербанк         |
                  | 4600000035  | 17.10.2019  | 01.01.2020   |                       |                          |                    | Волго-Вятский банк  |

        Сценарий: Обновление № договора поставщика

             Когда на странице Реестр Я раскрыл заголовок

             Когда на странице Реестр Я указал значение для поиска
                  | текст | 4600000040 |
            
             Когда на странице Реестр Я проверил данные в реестре
                  | ID договора | № договора поставщика |
                  | 4600000040  |                       |

             Когда на странице Реестр Я нажал на иконку
                  | иконка | edit |
            
             Когда на странице Реестр Я указал значение для текстового поля
                  | текст  | AutoTest №123 |
                  | диалог | Да            |

             Когда на странице Реестр Я нажал на кнопку
                  | текст  | Сохранить |
                  | диалог | Да        |

             Когда на странице Реестр Я проверил данные в реестре
                  | ID договора | № договора поставщика |
                  | 4600000040  | AutoTest №123         |

             Когда на странице Реестр Я нажал на кнопку
                  | текст | Применить |

             Когда на странице Реестр Я проверил данные в реестре
                  | ID договора | № договора поставщика |
                  | 4600000040  | AutoTest №123         |
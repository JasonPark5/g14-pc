import { dataBaseType } from '@/types/dataBase'

export interface measureType extends dataBaseType {
  envIepsAirSelfMeasureMainId: stringNull // 대기 자가측정 일련번호
  plantCd?: stringNull // 사업장코드
  measureYm?: stringNull // 대기 자가측정일
  envAirMstOutletId?: stringNull // 대기 배출구id
  outletName?: stringNull // 대기 배출구명
  outletIepsNo?: stringNull // 대기 배출구 IEPS 번호
  processCd?: stringNull // 공정번호
  processNo?: stringNull // 공정번호
  processName?: stringNull // 공정명
  outletIepsPlantMgtNo?: stringNull // 대기 배출구 사업장관리번호
  outletHeight?: numberNull // 대기 배출구 높이
  outletUpperStackDiameter?: numberNull // 대기 배출구 상단 Stack 직경
  outletInnerDiameter?: numberNull // 대기 배출구 내부 직경
  iepsAirSelfMeasureName?: stringNull // 대기 자가측정명
  subMeasures?: resultType[]
  delSubMeasures?: resultType[]
}

export interface resultType extends dataBaseType {
  envIepsAirSelfMeasureMainId: stringNull // 대기 자가측정 일련번호
  envIepsAirSelfMeasureSubId: stringNull // 대기 자가측정 상세 일련번호
  measureDt?: stringNull // 자가측정일시
  iepsWeatherCd?: stringNull // 날씨코드
  temperature?: numberNull // 기온(℃)
  humidity?: numberNull // 습도(%)
  pressure?: numberNull // 기압(mmHg)
  windDirection?: stringNull // 풍향
  windSpeed?: numberNull // 풍속(m/sec)
  envAirMstOutletId?: stringNull // 대기 배출구id
  gasAmount?: numberNull // 배출가스량(S ㎥/min)
  gasSpeed?: numberNull // 배출가스 유속(m/s)
  gasTemperature?: numberNull // 배출가스 온도(℃)
  moisture?: numberNull // 수분함량(%)
  standardOxygen?: numberNull // 표준산소농도(%)
  measuredOxygen?: numberNull // 실측산소농도(%)
  inspectItemIepsCd?: stringNull // IEPS 오염물질코드
  inspectItemValue?: numberNull // IEPS 오염물질 측정농도
  processCd?: stringNull
  processNo?: stringNull
  processName?: stringNull
  outletIepsNo?: stringNull
  outletIepsPlantMgtNo?: stringNull
  outletHeight?: numberNull
  outletUpperStackDiameter?: numberNull
  outletInnerDiameter?: numberNull
  reamrk?: stringNull // 비고
  envAirMstInspectItemName?: stringNull // 대기 검사항목명
  envAirMstInspectItemId?: stringNull // 대기 검사항목 일련번호
  airInspectUnitName?: stringNull // 대기 검사항목 단위명
  legalStandard?: numberNull // 법적기준
}

export interface measureTypeW extends dataBaseType {
  envIepsWaterSelfMeasureMainId: stringNull // 수질 자가측정 일련번호
  plantCd?: stringNull // 사업장코드
  measureYm?: stringNull // 수질 자가측정일
  envWaterMstOutletId?: stringNull // 수질 배출구id
  envWaterMstOutletName?: stringNull // 수질 배출구명
  outletIepsNo?: stringNull // 수질 배출구 IEPS 번호
  processCd?: stringNull // 공정번호
  processNo?: stringNull // 공정번호
  processName?: stringNull // 공정명
  outletIepsPlantMgtNo?: stringNull // 수질 배출구 사업장관리번호
  iepsWaterSelfMeasureName?: stringNull // 수질 자가측정명
  subWMeasures?: resultTypeW[]
  delSubWMeasures?: resultTypeW[]
}

export interface resultTypeW extends dataBaseType {
  envIepsWaterSelfMeasureMainId: stringNull // 수질 자가측정 일련번호
  envIepsWaterSelfMeasureSubId: stringNull // 수질 자가측정 상세 일련번호
  measureDt?: stringNull // 자가측정일시
  inflowExemptionCd?: stringNull // 유입수측정 면제구분 코드
  inflowNo?: numberNull // 유입시설번호
  envWaterMstOutletId?: stringNull // 수질 배출구id
  inflowCon?: numberNull // 배출가스량(S ㎥/min)
  outflowCon?: numberNull // 배출가스 유속(m/s)
  outflowValue?: numberNull // 배출가스 온도(℃)
  processCd?: stringNull
  processNo?: stringNull
  processName?: stringNull
  outletIepsNo?: stringNull
  outletIepsPlantMgtNo?: stringNull
  method?: stringNull // 측정방법
  reamrk?: stringNull // 비고
  inspectItemIepsCd?: stringNull // IEPS 오염물질코드
  inspectItemValue?: numberNull // IEPS 오염물질 측정농도
  envWaterMstInspectItemName?: stringNull // 수질 검사항목명
  envWaterMstInspectItemId?: stringNull // 수질 검사항목 일련번호
  waterInspectUnitName?: stringNull // 수질 검사항목 단위명
  legalStandard?: numberNull // 법적기준
}

export interface measureTypeSems extends dataBaseType {
  envSemsAirSelfMeasureMainId: stringNull // 대기 자가측정 일련번호
  plantCd?: stringNull // 사업장코드
  measureYm?: stringNull // 대기 자가측정일
  envAirMstOutletId?: stringNull // 대기 배출구id
  outletName?: stringNull // 대기 배출구명
  outletSemsId?: stringNull // 대기 배출구 IEPS 번호
  outletPermitNo?: stringNull // 대기 배출구 사업장관리번호
  semsAirSelfMeasureName?: stringNull // 대기 자가측정명
  subSemsMeasures?: resultTypeSems[]
  delSubSemsMeasures?: resultTypeSems[]
}

export interface resultTypeSems extends dataBaseType {
  envSemsAirSelfMeasureMainId: stringNull // 대기 자가측정 일련번호
  envSemsAirSelfMeasureSubId: stringNull // 대기 자가측정 상세 일련번호
  measureDt?: stringNull // 자가측정일시
  semsWeatherCd?: stringNull // 날씨코드
  semsWeatherName?: stringNull // 날씨명
  temperature?: numberNull // 기온(℃)
  humidity?: numberNull // 습도(%)
  pressure?: numberNull // 기압(mmHg)
  windDirectionCd?: stringNull // 풍향
  windSpeed?: numberNull // 풍속(m/sec)
  envAirMstOutletId?: stringNull // 대기 배출구id
  gasAmount?: numberNull // 배출가스량(S ㎥/min)
  gasSpeed?: numberNull // 배출가스 유속(m/s)
  gasTemperature?: numberNull // 배출가스 온도(℃)
  moisture?: numberNull // 수분함량(%)
  standardOxygenCd?: numberNull // 표준산소농도(%)
  standardOxygenName?: stringNull // 표준산소농도명
  measuredOxygen?: numberNull // 실측산소농도(%)
  inspectItemSemsCd?: stringNull // SEMS 오염물질코드
  inspectItemValue?: numberNull // SEMS 오염물질 측정농도
  outletSemsId?: stringNull
  outletPermitNo?: stringNull
  outletName?: stringNull
  fuelName?: stringNull // 연료명
  rawName?: stringNull // 원료명
  technician?: numberNull // 환경기술인 순번
  opinion?: stringNull // 환경기술인 의견
  machine?: stringNull // 검사기기
  method?: stringNull // 검사방법
  measureCd?: stringNull // 측정방법 코드
  measureMethodName?: stringNull // 측정방법명
  inspectorCd?: stringNull // 검사기관 코드
  inspectorName?: stringNull // 검사기관
  envAirMstInspectItemName?: stringNull // 대기 검사항목명
  envAirMstInspectItemId?: stringNull // 대기 검사항목 일련번호
  airInspectUnitName?: stringNull // 대기 검사항목 단위명
  legalStandard?: numberNull // 법적기준
}

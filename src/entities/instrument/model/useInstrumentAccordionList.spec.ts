import { renderHook, act } from "@testing-library/react-native";
import { useInstrumentAccordionList } from "./useInstrumentAccordionList";
import { Instrument } from "./type";

describe("useInstrumentAccordionList Test", () => {
  const mockInstrumentList: Instrument[] = [
    { instrumentId: 1, name: "꽹과리1", instrumentType: "꽹과리", club: "들녘", borrowAvailable: true },
    { instrumentId: 2, name: "꽹과리2", instrumentType: "꽹과리", club: "산틀", borrowAvailable: true },
    { instrumentId: 3, name: "징1", instrumentType: "징", club: "신명화랑", borrowAvailable: true },
    { instrumentId: 4, name: "장구1", instrumentType: "장구", club: "악반", borrowAvailable: true },
    { instrumentId: 5, name: "기타1", instrumentType: "기타", club: "들녘", borrowAvailable: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("초기 상태를 확인한다", () => {
    const { result } = renderHook(() =>
      useInstrumentAccordionList({ instrumentList: mockInstrumentList })
    );

    // 기본적으로 모든 아코디언이 열린 상태
    expect(result.current.isOpen("꽹과리")).toBe(true);
    expect(result.current.isOpen("징")).toBe(true);
    expect(result.current.isOpen("장구")).toBe(true);
    expect(result.current.isOpen("북")).toBe(true);
    expect(result.current.isOpen("소고")).toBe(true);
    expect(result.current.isOpen("기타")).toBe(true);

    // orderedInstrumentData가 올바르게 생성되는지 확인
    expect(result.current.orderedInstrumentData).toHaveLength(4); // 비어있지 않은 타입만
  });

  it("사용자가 아코디언을 토글하면 상태가 변경된다", () => {
    const { result } = renderHook(() =>
      useInstrumentAccordionList({ instrumentList: mockInstrumentList })
    );

    // 꽹과리 아코디언 닫기
    act(() => {
      result.current.toggleAccordion("꽹과리");
    });

    expect(result.current.isOpen("꽹과리")).toBe(false);
    expect(result.current.isOpen("징")).toBe(true); // 다른 것들은 그대로

    // 다시 열기
    act(() => {
      result.current.toggleAccordion("꽹과리");
    });

    expect(result.current.isOpen("꽹과리")).toBe(true);
  });

  it("여러 아코디언을 동시에 토글할 수 있다", () => {
    const { result } = renderHook(() =>
      useInstrumentAccordionList({ instrumentList: mockInstrumentList })
    );

    act(() => {
      result.current.toggleAccordion("꽹과리");
      result.current.toggleAccordion("징");
      result.current.toggleAccordion("장구");
    });

    expect(result.current.isOpen("꽹과리")).toBe(false);
    expect(result.current.isOpen("징")).toBe(false);
    expect(result.current.isOpen("장구")).toBe(false);
    expect(result.current.isOpen("북")).toBe(true);
    expect(result.current.isOpen("소고")).toBe(true);
    expect(result.current.isOpen("기타")).toBe(true);
  });

  it("악기 목록이 null일 때 빈 배열을 반환한다", () => {
    const { result } = renderHook(() =>
      useInstrumentAccordionList({ instrumentList: null })
    );

    expect(result.current.orderedInstrumentData).toEqual([]);
  });

  it("악기 목록이 비어있을 때 빈 배열을 반환한다", () => {
    const { result } = renderHook(() =>
      useInstrumentAccordionList({ instrumentList: [] })
    );

    expect(result.current.orderedInstrumentData).toEqual([]);
  });

  it("악기 타입별로 올바르게 그룹핑된다", () => {
    const { result } = renderHook(() =>
      useInstrumentAccordionList({ instrumentList: mockInstrumentList })
    );

    const orderedData = result.current.orderedInstrumentData;
    
    // 꽹과리 그룹 확인
    const kkwaenggwariGroup = orderedData.find(group => group.type === "꽹과리");
    expect(kkwaenggwariGroup).toBeDefined();
    expect(kkwaenggwariGroup?.instruments).toHaveLength(2);
    expect(kkwaenggwariGroup?.instruments[0].name).toBe("꽹과리1");
    expect(kkwaenggwariGroup?.instruments[1].name).toBe("꽹과리2");

    // 징 그룹 확인
    const jingGroup = orderedData.find(group => group.type === "징");
    expect(jingGroup).toBeDefined();
    expect(jingGroup?.instruments).toHaveLength(1);
    expect(jingGroup?.instruments[0].name).toBe("징1");

    // 장구 그룹 확인
    const jangguGroup = orderedData.find(group => group.type === "장구");
    expect(jangguGroup).toBeDefined();
    expect(jangguGroup?.instruments).toHaveLength(1);

    // 기타 그룹 확인
    const gitaGroup = orderedData.find(group => group.type === "기타");
    expect(gitaGroup).toBeDefined();
    expect(gitaGroup?.instruments).toHaveLength(1);
  });

  it("존재하지 않는 악기 타입에 대해서는 그룹이 생성되지 않는다", () => {
    const limitedInstrumentList: Instrument[] = [
      { instrumentId: 1, name: "꽹과리1", instrumentType: "꽹과리", club: "들녘", borrowAvailable: true },
      { instrumentId: 2, name: "징1", instrumentType: "징", club: "들녘", borrowAvailable: true },
    ];

    const { result } = renderHook(() =>
      useInstrumentAccordionList({ instrumentList: limitedInstrumentList })
    );

    const orderedData = result.current.orderedInstrumentData;
    
    expect(orderedData).toHaveLength(2); // 꽹과리, 징만 존재
    expect(orderedData.find(group => group.type === "꽹과리")).toBeDefined();
    expect(orderedData.find(group => group.type === "징")).toBeDefined();
    expect(orderedData.find(group => group.type === "장구")).toBeUndefined();
    expect(orderedData.find(group => group.type === "북")).toBeUndefined();
    expect(orderedData.find(group => group.type === "소고")).toBeUndefined();
    expect(orderedData.find(group => group.type === "기타")).toBeUndefined();
  });

  it("악기 목록이 변경되면 orderedInstrumentData가 재계산된다", () => {
    const initialList: Instrument[] = [
      { instrumentId: 1, name: "꽹과리1", instrumentType: "꽹과리", club: "들녘", borrowAvailable: true },
    ];

    const { result, rerender } = renderHook(
      ({ instrumentList }) => useInstrumentAccordionList({ instrumentList }),
      { initialProps: { instrumentList: initialList } }
    );

    expect(result.current.orderedInstrumentData).toHaveLength(1);

    // 악기 목록 변경
    const updatedList: Instrument[] = [
      { instrumentId: 1, name: "꽹과리1", instrumentType: "꽹과리", club: "들녘", borrowAvailable: true },
      { instrumentId: 2, name: "징1", instrumentType: "징", club: "들녘", borrowAvailable: true },
      { instrumentId: 3, name: "장구1", instrumentType: "장구", club: "들녘", borrowAvailable: true },
    ];

    rerender({ instrumentList: updatedList });

    expect(result.current.orderedInstrumentData).toHaveLength(3);
  });

  it("알 수 없는 타입에 대해서도 isOpen 함수가 정상 동작한다", () => {
    const { result } = renderHook(() =>
      useInstrumentAccordionList({ instrumentList: mockInstrumentList })
    );

    // 존재하지 않는 타입에 대해서는 false 반환
    expect(result.current.isOpen("존재하지않는타입")).toBe(false);

    // 토글 후에는 true 반환
    act(() => {
      result.current.toggleAccordion("존재하지않는타입");
    });

    expect(result.current.isOpen("존재하지않는타입")).toBe(true);
  });
}); 
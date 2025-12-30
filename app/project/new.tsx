import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Platform,
  StyleSheet,
  Pressable,
  Image,
  Button,
  Modal,
  TouchableOpacity,
  TextInput
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { IconSymbol } from "@/shared/ui/IconSymbol";
import LongButton from "@/shared/ui/Button";
import ValidatedInput from "@/shared/ui/ValidatedInput";
import { PortfolioImagePicker } from "@/entities/uesrs/ui/PortfolioImagePicker";
import { useFormValidator } from "@/shared/hooks/useFormValidator";
import Badge from "@/shared/ui/Badge";
import { useRouter } from "expo-router";

import { Calendar } from "react-native-calendars";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useProjectFormStore } from "@/features/projects/model/useProjectFormStore";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useCurrentUserStore } from "@/entities/uesrs/model/useCurrentUserStore";
import { useCreateProject } from "@/entities/projects/model/useCreateProject";
import { uploadImages } from "@/entities/projects/api/uploadImages";
import { useToast } from "@/shared/hooks/useToast";
import { generateRandomId } from "@/shared/lib/uuid";
const validateTitle = (value: { title: string }) => {
  const errors: Partial<Record<keyof typeof value, string>> = {};
  if (!value.title.trim()) {
    errors.title = "제목을 입력해주세요.";
  }
  return errors;
};

const CATEGORY_OPTIONS = [
  { slug: "emotional_snap", label: "감성스냅" },
  { slug: "profile_id", label: "프로필/증명" },
  { slug: "beauty_halfshot", label: "뷰티/반신샷" },
  { slug: "full_body_styling", label: "전신 스타일링" },
  { slug: "outdoor_trip", label: "야외 데이트/여행" },
  { slug: "concept_artwork", label: "컨셉/아트워크" },
  { slug: "film_vintage", label: "필름/빈티지 톤" },
  { slug: "with_pet", label: "반려동물과 함께" },
  { slug: "group_friendship", label: "단체 우정" },
  { slug: "commercial_lookbook", label: "상업/브랜드 룩북" },
];

const DEVICES = [
  { slug: "iphone", label: "아이폰" },
  { slug: "galaxy", label: "갤럭시" },
  { slug: "dslr_mirrorless", label: "DSLR/미러리스" },
  { slug: "film_instant", label: "필름/주석" },
];

const DAYS = [
  { label: "월", value: "mon" },
  { label: "화", value: "tue" },
  { label: "수", value: "wed" },
  { label: "목", value: "thu" },
  { label: "금", value: "fri" },
  { label: "토", value: "sat" },
  { label: "일", value: "sun" },
];

export default function CreateProjectPage() {
  const { form, setField, resetForm } = useProjectFormStore();
  const [images, setImages] = useState<string[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [range, setRange] = useState<{ start?: string; end?: string }>({});
  const [markedDates, setMarkedDates] = useState({});
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const [payOption, setPayOption] = useState<"manual" | "chat">("manual");
  const [localDurationInput, setLocalDurationInput] = useState(
    form.durationHours !== null ? String(form.durationHours) : ""
  );
  const { profile } = useCurrentUserStore();
  const toast = useToast();
  const {mutate: createProject, isPending: isCreatingProject} = useCreateProject();
  const totalPrice =
    typeof form.durationHours === "number" &&
    typeof form.pricePerHour === "number"
      ? form.durationHours * form.pricePerHour
      : null;

  dayjs.extend(isSameOrBefore);



  const onDayPress = (day) => {
    if (form.dateMode === "single") {
      const date = day.dateString;
      const updated = selectedDates.includes(date)
        ? selectedDates.filter((d) => d !== date)
        : [...selectedDates, date];

      setSelectedDates(updated);

      const marking: any = {};
      updated.forEach((d) => {
        marking[d] = {
          selected: true,
          selectedColor: "#9E77ED",
          selectedTextColor: "white",
        };
      });

      setMarkedDates(marking);
    } else {
      // Range 모드
      if (!range.start || range.end) {
        setRange({ start: day.dateString });
        setMarkedDates({
          [day.dateString]: {
            startingDay: true,
            endingDay: true,
            color: "#9E77ED",
            textColor: "white",
          },
        });
      } else {
        const start = dayjs(range.start);
        const end = dayjs(day.dateString);
        if (end.isBefore(start)) return;

        const marking: any = {};
        for (let d = start; d.isSameOrBefore(end); d = d.add(1, "day")) {
          const dateStr = d.format("YYYY-MM-DD");
          marking[dateStr] = {
            color: "#B692F6",
            textColor: "#000",
          };
        }
        marking[range.start] = {
          startingDay: true,
          color: "#9E77ED",
          textColor: "white",
        };
        marking[day.dateString] = {
          endingDay: true,
          color: "#9E77ED",
          textColor: "white",
        };

        setRange({ ...range, end: day.dateString });
        setMarkedDates(marking);
      }
    }
  };

  const { values, setValue, errors, validate } = useFormValidator(
    { title: "" },
    validateTitle
  );

  const router = useRouter();
  const handleBackWard = () => {
    resetForm();
    router.back();
  };

  const toggleCategory = (slug: string) => {
    const selected = form.projectCategories;

    let updated: string[];

    if (selected.includes(slug)) {
      updated = selected.filter((c) => c !== slug);
    } else if (selected.length >= 3) {
      updated = selected;
    } else {
      updated = [...selected, slug];
    }

    setField("projectCategories", updated);
  };

  const toggleDevice = (slug: string) => {
    const selected = form.projectDevices;

    let updated: string[];

    if (selected.includes(slug)) {
      updated = selected.filter((d) => d !== slug);
    } else {
      updated = [...selected, slug];
    }

    setField("projectDevices", updated);
  };

  const handleConfirmDates = () => {
    if (form.dateMode === "single") {
      setField("availableDates", selectedDates.sort());
    } else if (form.dateMode === "range" && range.start && range.end) {
      const start = dayjs(range.start);
      const end = dayjs(range.end);

      const dates = [];
      for (let d = start; d.isSameOrBefore(end); d = d.add(1, "day")) {
        dates.push(d.format("YYYY-MM-DD"));
      }

      setField("availableDates", dates);
    }

    setShowCalendar(false);
  };

  const handleAddShooting = () => {
    // 유효성 검사
    if (!form.inputLocation || !form.longitude || !form.latitude) {
      toast.showError(
        "위치 정보가 필요해요",
        "촬영 위치를 설정해주세요."
      );
      return;
    }

    let title = form.title.trim();
    if (!title) {
      title =
        form.recruitType === "photographer"
          ? "언제든지 여기서 촬영할 작가님을 구해요"
          : "언제든지 여기서 촬영할 모델님을 구해요";
    }

    const processedForm = {
      ...form,
      title,
      state: "WAITING_MATCH",
      createdAt: new Date(),
      shootingCode: generateRandomId(),
      availableStartTime: form.availableStartTime?.toTimeString().split(" ")[0],
      availableEndTime: form.availableEndTime?.toTimeString().split(" ")[0],
    };

    createProject(
      { form: processedForm, images },
      {
        onSuccess: async (data: any) => {
          if (images.length > 0) {
            const uris = images.map((it: any) =>
              typeof it === "string" ? it : it?.uri ?? it?.path ?? it?.localUri
            ).filter(Boolean);
    
            try {
              await uploadImages({ uris, projectId: data.id });
            } catch (e) {
              console.error(e);
            }
          }
          resetForm();
          router.back();
        },
        onError: (error) => {
          console.error('에러' , error);
          toast.showError("프로젝트 등록에 실패했어요", "잠시 후 다시 시도해주세요.");
        },
      }
    );
  };

  useEffect(() => {
    if (profile) {
      setField("userId", profile.id);
    }
  }, [profile]);

  useEffect(() => {
    setSelectedDates([]);
    setRange({});
    setMarkedDates({});
  }, [form.dateMode]);

  useEffect(() => {
    const validOptions =
      form.recruitType === "photographer"
        ? ["no_preference", "own_device", "photographer_device"]
        : ["own_device", "model_device"];

    if (!validOptions.includes(form.deviceSource)) {
      setField("deviceSource", validOptions[0]);
    }
  }, [form.recruitType]);

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: StatusBar.currentHeight,
      }}
    >
      <Pressable
        style={{ paddingVertical: 12, paddingHorizontal: 16 }}
        onPress={handleBackWard}
      >
        <IconSymbol size={24} name="x" color={"#181D27"} />
      </Pressable>
      <ScrollView>
        <View style={styles.card}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
            촬영 맵핀 설정
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 16 }}>
            구인 유형
          </Text>
          <Text style={styles.subTitle}>{`촬영가능한 근처 ${
            form.recruitType === "photographer" ? "작가" : "모델"
          }님을 구해요`}</Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Badge
              onPress={() => setField("recruitType", "photographer")}
              label={"작가 구인"}
              backgroundColor={
                form.recruitType === "photographer" ? "#d5d7da" : "#f5f5f5"
              }
              color={form.recruitType === "photographer" ? "#000" : "#535862"}
              borderColor={"transparent"}
              borderRadius={999}
              borderWidth={1}
            />
            <Badge
              onPress={() => setField("recruitType", "model")}
              label={"모델 구인"}
              backgroundColor={
                form.recruitType === "model" ? "#d5d7da" : "#f5f5f5"
              }
              color={form.recruitType === "model" ? "#000" : "#535862"}
              borderColor="transparent"
              borderRadius={999}
              borderWidth={1}
            />
          </View>

          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 16 }}>
            촬영 유형
          </Text>

          <Text style={styles.subTitle}>
            {form.pinDisplay === "always"
              ? "상시 촬영 맵핀은 삭제 전까지 계속 지도에 표시돼요"
              : "버블 촬영 맵핀은 일정 시간내에 지도에 표시되고 사라져요"}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Badge
              onPress={() => setField("pinDisplay", "bubble")}
              label={"버블"}
              backgroundColor={
                form.pinDisplay === "bubble" ? "#d5d7da" : "#f5f5f5"
              }
              color={form.pinDisplay === "bubble" ? "#000" : "#535862"}
              borderColor={"transparent"}
              borderRadius={999}
              borderWidth={1}
              iconPosition="right"
            />
            <Badge
              onPress={() => setField("pinDisplay", "always")}
              label={"상시"}
              backgroundColor={
                form.pinDisplay === "always" ? "#d5d7da" : "#f5f5f5"
              }
              color={form.pinDisplay === "always" ? "#000" : "#535862"}
              borderColor={"transparent"}
              borderRadius={999}
              borderWidth={1}
            />
          </View>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 16 }}>
            촬영 가능 일정
          </Text>
          {form.pinDisplay === "always" && (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              {DAYS.map((day) => {
                const isSelected = form.availableDays.includes(day.value);

                const handlePress = () => {
                  const updatedDays = isSelected
                    ? form.availableDays.filter((d) => d !== day.value) // 제거
                    : [...form.availableDays, day.value]; // 추가
                  setField("availableDays", updatedDays);
                };

                return (
                  <Badge
                    key={day.value}
                    onPress={handlePress}
                    label={day.label}
                    backgroundColor={isSelected ? "#d5d7da" : "#f5f5f5"}
                    color={isSelected ? "#000000" : "#535862"}
                    borderColor="#f5f5f5"
                    borderRadius={999}
                    borderWidth={1}
                  />
                );
              })}
            </View>
          )}

          {form.pinDisplay === "bubble" && (
            <TouchableOpacity
              onPress={() => setShowCalendar(true)}
              style={styles.dateInput}
            >
              <Text style={styles.dateText}>
                {form.dateMode === "range"
                  ? range.start && range.end
                    ? `${range.start} ~ ${range.end}`
                    : "날짜 범위를 선택해주세요"
                  : selectedDates.length === 1
                  ? selectedDates[0]
                  : selectedDates.length > 1
                  ? `${selectedDates[0]} 외 ${selectedDates.length - 1}일`
                  : "날짜를 선택해주세요"}
              </Text>
            </TouchableOpacity>
          )}

          <Modal
            visible={showCalendar}
            animationType="slide"
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
                <TouchableOpacity
                  onPress={() => setField("dateMode", "single")}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    alignItems: "center",
                    borderBottomWidth: 2,
                    borderColor:
                      form.dateMode === "single" ? "#B692F6" : "#E9EAEB",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: form.dateMode === "single" ? "#B692F6" : "#535862",
                    }}
                  >
                    날짜
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setField("dateMode", "range")}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    alignItems: "center",
                    borderBottomWidth: 2,
                    borderColor:
                      form.dateMode === "range" ? "#B692F6" : "#E9EAEB",
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: form.dateMode === "range" ? "#B692F6" : "#535862",
                    }}
                  >
                    기간
                  </Text>
                </TouchableOpacity>
              </View>
              <View>
                <View
                  style={{
                    backgroundColor: "white",
                    borderRadius: 10,
                    padding: 10,
                  }}
                >
                  <Calendar
                    markingType={
                      form.dateMode === "single" ? "multi-dot" : "period"
                    }
                    markedDates={markedDates}
                    onDayPress={onDayPress}
                    minDate={dayjs().format("YYYY-MM-DD")}
                    maxDate={dayjs().add(1, "month").format("YYYY-MM-DD")}
                  />
                  <Button
                    color={"#9E77ED"}
                    title="확인"
                    onPress={handleConfirmDates}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <TouchableOpacity
            onPress={() => {
              setShowTimePicker(true);
            }}
            style={styles.timeInput}
          >
            <Text style={styles.timeText}>
              {`${form.availableStartTime.getHours()}시 ${form.availableStartTime.getMinutes()}분`}{" "}
              ~
              {` ${form.availableEndTime.getHours()}시 ${form.availableEndTime.getMinutes()}분`}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <RNDateTimePicker
              value={form.availableStartTime}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              mode="time"
              onChange={(event, selectedDate) => {
                setShowTimePicker(false);
                if (selectedDate) {
                  setField("availableStartTime", selectedDate);
                  setShowEndTimePicker(true); // 시작 선택 후 종료 선택으로 자연스럽게 연결
                }
              }}
              locale="ko-KR"
            />
          )}

          {showEndTimePicker && (
            <RNDateTimePicker
              value={form.availableEndTime}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              mode="time"
              onChange={(event, selectedDate) => {
                setShowEndTimePicker(false);
                if (selectedDate) setField("availableEndTime", selectedDate);
              }}
              locale="ko-KR"
            />
          )}
          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 16 }}>
            촬영 위치
          </Text>
          <Text style={styles.subTitle}>
            {form.locationAddress || "알 수 없음"}
          </Text>
          <ValidatedInput
            readOnly={true}
            value={form.inputLocation || "알 수 없음"}
            onChangeText={(text) => setValue("title", text)}
            autoCapitalize="none"
          />
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 16 }}>
            촬영 시간
          </Text>
          <ValidatedInput
            placeholder="30분(=0.5) 단위 입력(예:1, 1.5)"
            value={localDurationInput}
            onChangeText={(text) => {
              setLocalDurationInput(text);
              const parsed = parseFloat(text.replace(",", "."));
              if (!isNaN(parsed)) {
                setField("durationHours", parsed);
              } else {
                setField("durationHours", null);
              }
            }}
            autoCapitalize="none"
            keyboardType="numbers-and-punctuation"
          />
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 16 }}>
            촬영 페이
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginBottom: 16,
            }}
          >
            <Badge
              onPress={() => setField("isPaid", false)}
              label={"무료"}
              backgroundColor={!form.isPaid ? "#d5d7da" : "#f5f5f5"}
              color={!form.isPaid ? "#000" : "#535862"}
              borderColor="transparent"
              borderRadius={999}
              borderWidth={1}
            />
            <Badge
              onPress={() => setField("isPaid", true)}
              label={"유료"}
              backgroundColor={form.isPaid ? "#d5d7da" : "#f5f5f5"}
              color={form.isPaid ? "#000" : "#535862"}
              borderColor="transparent"
              borderRadius={999}
              borderWidth={1}
              icon={
                <IconSymbol size={12} name="chevron.right" color={"#181D27"} />
              }
              iconPosition="right"
            />
            {form.isPaid && (
              <>
                <Badge
                  onPress={() => setPayOption("manual")}
                  label={"직접 입력"}
                  backgroundColor={
                    payOption === "manual" ? "#d5d7da" : "#f5f5f5"
                  }
                  color={payOption === "manual" ? "#000" : "#535862"}
                  borderColor="transparent"
                  borderRadius={999}
                  borderWidth={1}
                />
                <Badge
                  onPress={() => {
                    setPayOption("chat");
                    setField("pricePerHour", null);
                  }}
                  label={"채팅 협의"}
                  backgroundColor={payOption === "chat" ? "#d5d7da" : "#f5f5f5"}
                  color={payOption === "chat" ? "#000" : "#535862"}
                  borderColor="transparent"
                  borderRadius={999}
                  borderWidth={1}
                />
              </>
            )}
          </View>
          {!form.isPaid && (
            <View
              style={{
                borderWidth: 1,
                borderColor: "#d5d7da",
                borderRadius: 8,
              }}
            >
              <Picker
                selectedValue={form.requestNote}
                onValueChange={(value) => setField("requestNote", value)}
              >
                <Picker.Item label="감사 인사 전달 💜" value="thanks" />
                <Picker.Item label="작은 부탁 가능 💜" value="favor" />
                <Picker.Item label="SNS 태그 약속 💜" value="sns_tag" />
                <Picker.Item label="포트폴리오 교류 💜" value="portfolio" />
                <Picker.Item label="원본 모두 제공 💜" value="original" />
              </Picker>
            </View>
          )}
          {form.isPaid && payOption === "manual" && (
            <>
              <ValidatedInput
                placeholder={"숫자 입력(예:10000, 15000) 원/시간"}
                value={
                  form.pricePerHour === null || isNaN(form.pricePerHour)
                    ? ""
                    : String(form.pricePerHour)
                }
                onChangeText={(text) => {
                  const parsed = parseInt(text.replace(/,/g, ""), 10);
                  if (!isNaN(parsed)) {
                    setField("pricePerHour", parsed);
                  } else {
                    setField("pricePerHour", null);
                  }
                }}
                autoCapitalize="none"
                keyboardType="numeric"
              />
              {totalPrice !== null && (
                <Text
                  style={{ marginTop: 8 }}
                >{`예상 총 금액: ${totalPrice.toLocaleString()} 원`}</Text>
              )}
            </>
          )}
        </View>

        <View style={styles.card}>
          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 16 }}>
            추가 태그
          </Text>
          <Text style={styles.subTitle}>
            원하는 촬영 스타일을 1~3개 선택해주세요
          </Text>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {CATEGORY_OPTIONS.map(({ slug, label }) => {
              const selected = form.projectCategories.includes(slug);
              return (
                <Badge
                  key={slug}
                  label={label}
                  onPress={() => toggleCategory(slug)}
                  backgroundColor={selected ? "#d5d7da" : "#f5f5f5"}
                  color={selected ? "#000" : "#535862"}
                  borderColor="transparent"
                  borderRadius={999}
                  borderWidth={1}
                />
              );
            })}
          </View>

          <Text style={{ fontSize: 16, fontWeight: "bold", marginTop: 16 }}>
            촬영 기기
          </Text>
          <Text style={styles.subTitle}>
            선호하거나 사용 가능한 촐영 기기를 선택해주세요
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#d5d7da",
              borderRadius: 8,
            }}
          >
            {form.recruitType === "photographer" ? (
              <Picker
                selectedValue={form.deviceSource}
                onValueChange={(value) => setField("deviceSource", value)}
              >
                <Picker.Item label="기기 상관 없어요" value="no_preference" />
                <Picker.Item label="제 기기로 촬영 원해요" value="own_device" />
                <Picker.Item
                  label="작가님 기기로 촬영 원해요"
                  value="photographer_device"
                />
              </Picker>
            ) : (
              <Picker
                selectedValue={form.deviceSource}
                onValueChange={(value) => setField("deviceSource", value)}
              >
                <Picker.Item label="제 기기로 촬영 원해요" value="own_device" />
                <Picker.Item
                  label="모델님 기기로 촬영 원해요"
                  value="model_device"
                />
              </Picker>
            )}
          </View>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}
          ></View>

          {form.deviceSource && form.deviceSource !== "no_preference" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
                marginTop: 8,
              }}
            >
              {DEVICES.map(({ slug, label }) => {
                const selected = form.projectDevices.includes(slug);
                return (
                  <Badge
                    key={slug}
                    label={label}
                    onPress={() => toggleDevice(slug)}
                    backgroundColor={selected ? "#d5d7da" : "#f5f5f5"}
                    color={selected ? "#000" : "#535862"}
                    borderColor="transparent"
                    borderRadius={999}
                    borderWidth={1}
                  />
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 16 }}>
            게시글
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 16 }}>
            제목
          </Text>
          <ValidatedInput
            placeholder={
              form.recruitType === "photographer"
                ? "언제든지 여기서 촬영할 작가님을 구해요"
                : "언제든지 여기서 촬영할 모델님을 구해요"
            }
            value={form.title}
            onChangeText={(text) => setField("title", text)}
            autoCapitalize="none"
          />
          {isDetailExpanded && (
            <View>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 16 }}
              >
                촬영 컨셉
              </Text>

              <Text style={styles.subTitle}>
                이런 느낌이면 좋겠어요 :) 1~3장만 올려주세요
              </Text>

              <PortfolioImagePicker
                images={images}
                onImagesChange={setImages}
                maxImages={3}
                title="컨셉 이미지"
                description="촬영하고 싶은 컨셉 이미지를 추가해주세요"
              />
              <Text
                style={{ fontSize: 16, fontWeight: "bold", marginBottom: 16 }}
              >
                상세 설명
              </Text>
                  <View style={styles.wrapper}>
                    <TextInput
                    multiline={true}
                    textAlignVertical="top"
                    value={form.description}
                    onChangeText={(text) => setField("description", text)}
                      style={[
                        styles.input,
                        {
                          backgroundColor: "#fff",
                          color:"#000",
                          borderColor:  "#ccc",
                          minHeight: 154
                        },
                      ]}
                      placeholderTextColor={"#999"}
                      placeholder={`추가 설명이 필요하다면 작성해주세요
예:
- 촬영 기기: iPhone XS 모델이면 좋겠어요
- 니즈: 포즈를 잘 추천해주셨으면 좋겠어요
- 촬영 시간: 9:20 ~ 15:20 (6시간)`}
                    />
                  </View>
            </View>
          )}

          <Pressable style={{display:'flex', flexDirection:'row', backgroundColor:'#f5f5f5', padding:12 , alignItems:'center', justifyContent:'center'}} onPress={() => setIsDetailExpanded(!isDetailExpanded)}>
            <Text style={{marginLeft: 'auto'}}>
              {isDetailExpanded ? "추가 정보 접기" : "추가 정보 펼치기"}
            </Text>
            <IconSymbol style={{marginLeft: 'auto'}} size={20} name={`${isDetailExpanded ? 'chevron.up' : 'chevron.down'}`} color={"#181D27"} />
          </Pressable>
        </View>
      </ScrollView>
      <View style={{ marginBottom: 52, marginTop: 20 }}>
        <LongButton
          loading={isCreatingProject}
          disabled={isCreatingProject}
          title={"촬영 모집글 등록하기"}
          onPress={handleAddShooting}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,

    elevation: Platform.OS === "android" ? 2 : 0,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: "regular",
    marginBottom: 8,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  dateText: {
    color: "#333",
    fontSize: 16,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  timeText: {
    fontSize: 16,
    color: "#333",
  },
  wrapper: {
    marginBottom: 20,
  },
  input: {
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
});

import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';

interface ConfirmModalProps {
  visible: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  visible,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <Pressable className='flex-1 justify-center items-center bg-bg-overlay-solid' onPress={onCancel}>
        <Pressable className="bg-bg-layer-default w-11/12 rounded-16 p-28" onPress={(e) => e.stopPropagation()}>
          <Text className='heading2-semiBold text-fg-neutral-solid'>{title}</Text>
          {description && <Text className='body2-regular text-fg-neutral-muted mt-8'>{description}</Text>}

          <View className='flex flex-row w-full justify-end gap-24 mt-28'>
            <Pressable onPress={onCancel}>
              <Text className='body1-semiBold text-fg-neutral-muted'>{cancelText}</Text>
            </Pressable>
            <Pressable onPress={onConfirm}>
              <Text className='body1-semiBold text-fg-brand'>{confirmText}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
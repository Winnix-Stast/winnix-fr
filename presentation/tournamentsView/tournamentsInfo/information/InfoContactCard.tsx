import { StyleSheet, View } from 'react-native';
import { IconName, WinnixIcon } from '@/presentation/plugins/Icon';
import { Colors, Flex, Radius } from '@/presentation/styles/global-styles';
import { CustomText } from '@/presentation/theme/components/CustomText';
import { GradientContainer } from '@/presentation/theme/components/GradientCard';

interface ContactItemProps {
  icon: IconName;
  type: string;
  value: string;
}

const ContactItem = ({ icon, type, value }: ContactItemProps) => (
  <View style={styles.itemContainer}>
    <WinnixIcon name={icon} size={26} color={Colors.primary} />
    <View>
      <CustomText label={type} size={12} color={Colors.secondary} />
      <CustomText label={value} size={15} color={Colors.light} weight='bold' />
    </View>
  </View>
);

interface SubOrganizerRowProps {
  user: any;
}

const SubOrganizerRow = ({ user }: SubOrganizerRowProps) => (
  <View style={styles.subOrganizerRow}>
    <WinnixIcon name='person-circle-outline' size={22} color={Colors.secondaryLigth} />
    <View>
      <CustomText
        label={user.username || user.nickname || 'Sub-organizador'}
        size={14}
        color={Colors.light}
        weight='bold'
      />
      {user.email && (
        <CustomText label={user.email} size={12} color={Colors.text_tertiary} />
      )}
    </View>
  </View>
);

interface Props {
  organizer?: any;
  subOrganizers?: any[];
}

export const InfoContactCard = ({ organizer, subOrganizers = [] }: Props) => {
  const contactItems: ContactItemProps[] = [];

  if (organizer?.email) {
    contactItems.push({
      icon: 'mail-outline',
      type: 'Correo electrónico',
      value: organizer.email,
    });
  }

  if (organizer?.phoneNumber) {
    contactItems.push({
      icon: 'call-outline',
      type: 'Teléfono',
      value: String(organizer.phoneNumber),
    });
  }

  if (organizer?.contact?.phone) {
    contactItems.push({
      icon: 'chatbubble-ellipses-outline',
      type: 'Contacto',
      value: String(organizer.contact.phone),
    });
  }

  const hasContact = contactItems.length > 0 || subOrganizers.length > 0;

  return (
    <GradientContainer
      colors={[Colors.dark, Colors.secondaryLigth]}
      borderColor={Colors.secondaryLigth}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <WinnixIcon
            name='chatbox-ellipses-outline'
            size={30}
            color={Colors.secondaryLigth}
          />
          <CustomText
            label='Contacto y Soporte'
            size={20}
            weight='bold'
            color={Colors.light}
          />
        </View>

        {!hasContact ? (
          <CustomText
            label='El organizador no ha publicado información de contacto.'
            color={Colors.gray}
            size={14}
            style={{ textAlign: 'center', marginTop: 12 }}
          />
        ) : (
          <>
            {/* Main organizer contacts */}
            {contactItems.length > 0 && (
              <View style={styles.list}>
                {contactItems.map((item, i) => (
                  <ContactItem
                    key={i}
                    icon={item.icon}
                    type={item.type}
                    value={item.value}
                  />
                ))}
              </View>
            )}

            {/* Sub-organizers */}
            {subOrganizers.length > 0 && (
              <View style={styles.subOrganizerSection}>
                <View style={styles.subOrganizerHeader}>
                  <WinnixIcon
                    name='people-outline'
                    size={20}
                    color={Colors.secondaryLigth}
                  />
                  <CustomText
                    label='Sub-Organizadores'
                    size={15}
                    weight='bold'
                    color={Colors.light}
                  />
                </View>
                {subOrganizers.map((u: any) => (
                  <SubOrganizerRow key={u._id} user={u} />
                ))}
              </View>
            )}
          </>
        )}
      </View>
    </GradientContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Flex.columnCenter,
    justifyContent: 'flex-start',
    gap: 8,
    width: '100%',
  },
  header: {
    ...Flex.rowCenter,
    justifyContent: 'flex-start',
    width: '100%',
    gap: 8,
  },
  list: {
    width: '100%',
    marginTop: 12,
    gap: 10,
  },
  itemContainer: {
    ...Flex.rowCenter,
    justifyContent: 'flex-start',
    gap: 12,
    backgroundColor: 'rgba(31, 106, 224, 0.35)',
    padding: 14,
    borderRadius: Radius.medium,
  },
  subOrganizerSection: {
    width: '100%',
    marginTop: 12,
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: Radius.medium,
    padding: 12,
  },
  subOrganizerHeader: {
    ...Flex.rowCenter,
    justifyContent: 'flex-start',
    gap: 8,
    marginBottom: 4,
  },
  subOrganizerRow: {
    ...Flex.rowCenter,
    justifyContent: 'flex-start',
    gap: 10,
  },
});

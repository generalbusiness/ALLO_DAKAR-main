import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { NavigationProp } from '../../lib/navigation';
import { useApp } from '../../contexts/AppContext';

const DOCUMENT_TYPES = [
  'cni',
  'driverLicense',
  'vehicleRegistration',
  'vehicleInsurance'
] as const;

type DocumentKey = typeof DOCUMENT_TYPES[number];

type DocumentStatus = {
  fileName: string | null;
  uri: string | null;
};

type DocumentsState = {
  [key in DocumentKey]: DocumentStatus;
};

interface DriverRegistrationProps {
  setUserType: (type: 'driver') => void;
  setIsLoggedIn: (value: boolean) => void;
}

export default function DriverRegistration({ setUserType, setIsLoggedIn }: DriverRegistrationProps) {
  const navigation = useNavigation<NavigationProp<'DriverRegistration'>>();
  const { login } = useApp();
  const insets = useSafeAreaInsets();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    acceptTerms: false
  });

  const [isUploading, setIsUploading] = useState(false);

  const [uploadedDocuments, setUploadedDocuments] = useState<DocumentsState>({
    cni: { fileName: null, uri: null },
    driverLicense: { fileName: null, uri: null },
    vehicleRegistration: { fileName: null, uri: null },
    vehicleInsurance: { fileName: null, uri: null },
  });

  const allDocumentsUploaded = DOCUMENT_TYPES.every(docKey => uploadedDocuments[docKey].fileName !== null);

  const handleDocumentUpload = async (docKey: DocumentKey, docName: string) => {
    try {
      setIsUploading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        setIsUploading(false);
        return;
      }

      const asset = result.assets?.[0];
      if (!asset) {
        Alert.alert("Erreur", "Aucun fichier sélectionné.");
        setIsUploading(false);
        return;
      }

      const fileName = asset.name || asset.uri.split('/').pop() || "document";

      setUploadedDocuments(prev => ({
        ...prev,
        [docKey]: { fileName, uri: asset.uri }
      }));

      Alert.alert("Succès", `${docName} uploadé : ${fileName}`);

    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      Alert.alert("Erreur", `Impossible d'uploader le document ${docName}.`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveDocument = (docKey: DocumentKey, docName: string) => {
    Alert.alert(
      "Confirmation",
      `Êtes-vous sûr de vouloir retirer le document ${docName} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Retirer",
          style: "destructive",
          onPress: () => {
            setUploadedDocuments(prev => ({
              ...prev,
              [docKey]: { fileName: null, uri: null }
            }));
            Alert.alert("Retiré", `${docName} a été retiré.`);
          },
        }
      ]
    );
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.phone || !formData.password || !formData.acceptTerms || !allDocumentsUploaded) {
      if (!allDocumentsUploaded) {
        Alert.alert("Documents manquants", "Veuillez soumettre tous les documents requis.");
      } else {
        Alert.alert("Erreur", "Veuillez remplir tous les champs.");
      }
      return;
    }

    setUserType('driver');
    setIsLoggedIn(true);

    login({
      id: Date.now().toString(),
      name: formData.name,
      email: `${formData.phone}@example.com`,
      phone: formData.phone,
      type: 'driver',
    });

    navigation.navigate('DriverDashboard' as any);
  };

  const documentsConfig = [
    { key: 'cni', label: "Carte d'identité (CNI)" },
    { key: 'driverLicense', label: "Permis de conduire" },
    { key: 'vehicleRegistration', label: "Carte grise du véhicule" },
    { key: 'vehicleInsurance', label: "Assurance du véhicule" },
  ];

  return (
    <View style={styles.container}>
      
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 24) }]}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Inscription Chauffeur</Text>
        </View>
      </View>

      {isUploading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#facc15" />
          <Text style={styles.loadingText}>Ouverture du sélecteur...</Text>
        </View>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>

          <View style={styles.field}>
            <Text style={styles.label}>Prénom & Nom</Text>
            <TextInput
              style={styles.input}
              placeholder="Moussa Ndiaye"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Numéro de téléphone</Text>
            <TextInput
              style={styles.input}
              placeholder="+221 77 123 45 67"
              value={formData.phone}
              keyboardType="phone-pad"
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              secureTextEntry
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
            />
          </View>

          <View style={styles.documentsSection}>
            <Text style={styles.label}>Documents à soumettre</Text>

            <View style={styles.documentsList}>
              {documentsConfig.map(({ key, label }) => {
                const k = key as DocumentKey; // 🔥 Correction TypeScript
                const docStatus = uploadedDocuments[k];
                const isUploaded = docStatus.fileName !== null;

                return (
                  <View key={k} style={{ gap: 4 }}>
                    <TouchableOpacity
                      style={isUploaded ? styles.documentButtonUploaded : styles.documentButton}
                      onPress={() => isUploaded ? handleRemoveDocument(k, label) : handleDocumentUpload(k, label)}
                      disabled={isUploading}
                    >
                      <Ionicons
                        name={isUploaded ? "checkmark-circle" : "cloud-upload"}
                        size={20}
                        color={isUploaded ? "#10b981" : "#6b7280"}
                      />

                      <Text style={[styles.documentText, isUploaded && styles.documentTextUploaded]}>
                        {label}
                      </Text>

                      <Ionicons
                        name={isUploaded ? "close-circle" : "add"}
                        size={20}
                        color={isUploaded ? "#dc2626" : "#6b7280"}
                        style={{ marginLeft: 'auto' }}
                      />
                    </TouchableOpacity>

                    {isUploaded && (
                      <Text style={styles.fileNameText}>
                        Fichier : {docStatus.fileName}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>

            <Text style={[styles.documentStatusText, allDocumentsUploaded && styles.documentStatusTextComplete]}>
              {allDocumentsUploaded
                ? "✅ Tous les documents sont prêts !"
                : `❌ ${DOCUMENT_TYPES.length - Object.values(uploadedDocuments).filter(doc => doc.fileName !== null).length} document(s) manquant(s).`}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setFormData({ ...formData, acceptTerms: !formData.acceptTerms })}
            style={styles.checkboxContainer}
          >
            <View style={[styles.checkbox, formData.acceptTerms && styles.checkboxChecked]}>
              {formData.acceptTerms && (
                <Ionicons name="checkmark" size={16} color="#ffffff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>
              J'accepte les conditions d'utilisation et la politique de confidentialité d'Allô Dakar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!formData.acceptTerms || !allDocumentsUploaded || isUploading}
            style={[
              styles.submitButton,
              (!formData.acceptTerms || !allDocumentsUploaded || isUploading) && styles.submitButtonDisabled
            ]}
          >
            <Text style={styles.submitButtonText}>Je m'inscris</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 100 },
  header: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 24,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  backButton: { padding: 8, borderRadius: 12 },
  headerTitle: { fontSize: 24, fontWeight: '600', color: '#1f2937' },

  form: { maxWidth: 400, width: '100%', alignSelf: 'center', gap: 24 },

  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 10,
    fontSize: 16,
    color: '#1f2937',
    height: 48,
  },

  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: '500', color: '#1f2937' },

  documentsSection: {
    gap: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 16,
  },

  documentsList: { gap: 12 },

  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },

  documentButtonUploaded: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    padding: 16,
    borderWidth: 2,
    borderColor: '#10b981',
    borderRadius: 12,
    backgroundColor: '#f0fdf4',
  },

  documentText: { fontSize: 16, color: '#374151' },
  documentTextUploaded: { fontWeight: '600', color: '#065f46' },

  fileNameText: { fontSize: 12, color: '#4b5563', marginLeft: 32 },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.8)',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: { marginTop: 10, fontSize: 16, color: '#1f2937', fontWeight: '500' },

  documentStatusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#dc2626',
    marginTop: 8,
    textAlign: 'center',
  },

  documentStatusTextComplete: { color: '#065f46' },

  checkboxContainer: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 16 },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  checkboxChecked: { backgroundColor: '#facc15', borderColor: '#facc15' },

  checkboxLabel: { fontSize: 14, color: '#6b7280', flex: 1, lineHeight: 20 },

  submitButton: {
    width: '100%',
    backgroundColor: '#facc15',
    borderRadius: 12,
    padding: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { fontSize: 18, fontWeight: '600', color: '#1f2937' },
});

// LanguageContext.tsx - Version FINALE CORRIGÉE
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

type Language = 'en' | 'fr' | 'mg' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Traductions COMPLÈTES avec TOUTES les clés utilisées dans vos pages
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.males': 'Males',
    'nav.females': 'Females',
    'nav.litters': 'Litters',
    'nav.products': 'Products',
    'nav.book': 'Book',
    'nav.contact': 'Contact',
    'nav.news': 'News',

    // Hero
    'hero.tagline': 'RR BOERBOELS breeds Boerboels from top-quality bloodlines in Madagascar. Our program emphasizes proven pedigrees, rigorous veterinary checks, and professional socialization, ensuring that every puppy is genetically healthy, well-balanced, and ready to fulfill its role as a guard dog or companion.',
    'hero.cta.primary': 'Book a Stud Date',
    'hero.cta.secondary': 'Meet the Dogs',
    'hero.scroll': 'Scroll',

    // Breed
    'breed.label': 'The Breed',
    'breed.headline1': 'Built to Guard.',
    'breed.headline2': 'Bred to Bond.',
    'breed.body': 'The Boerboel is a South African guardian breed: powerful, confident, and fiercely loyal. At RR BOERBOELS we breed exclusively high-line Boerboels selected for health, correct type, and stable temperament. Puppies are raised with structured early socialization and veterinary oversight so they develop into reliable guardians and devoted companions.',
    'breed.cta': 'Read Our Story',

    // Featured Male
    'male.label': 'Featured Male',
    'male.body': "Son of CDH BULLET - International Champion. Oliver is our outstanding male Boerboel, carrying the prestigious bloodline of CDH BULLET, an International Champion. He exemplifies the breed standard with his powerful build, confident temperament, and excellent health clearances. Oliver is available for stud services to approved females.",
    'male.cta': 'Request Stud Info',

    // Featured Female
    'female.label': 'Featured Female',
    'female.body': "Daughter of iCONIC John Wick - Madagascar Puppy Champion October 2025. Iggy is our exceptional female Boerboel, daughter of the renowned iCONIC John Wick. She was crowned Madagascar Puppy Champion at Boerboel Day in October 2025, organized by the Madagascar Boerboel Club. Iggy combines beauty with an outstanding temperament, making her an ideal representative of the breed and a future cornerstone of our breeding program.",
    'female.cta': 'See Her Pedigree',

    // Litters / Waitlist
    'litters.label': 'Upcoming Litters',
    'litters.headline1': 'The Next Generation',
    'litters.headline2': 'Is Coming',
    'litters.body': 'Planned pairings with clear health testing, strong type, and stable temperaments. Join the waitlist to be notified when reservations open.',
    'litters.cta': 'Join the Waitlist',
    'litters.expectedPairing': 'Expected Pairing',
    'litters.sire': 'Sire',
    'litters.dam': 'Dam',
    'litters.expected': 'Expected',
    
    // Gallery
    'gallery.label': 'Puppy Gallery',
    'gallery.title': 'Previous',
    'gallery.subtitle': 'Litters',
    'gallery.description': 'Take a look at our previous litters to see the quality and beauty of RR Boerboel puppies.',
    'gallery.empty': 'No photos available yet',
    
    // Waitlist Dialog
    'waitlist.title': 'Join the Waitlist',
    'waitlist.description': 'Be the first to know when reservations open for our upcoming litter.',
    'waitlist.name': 'Name (optional)',
    'waitlist.namePlaceholder': 'Your name',
    'waitlist.email': 'Email Address',
    'waitlist.emailPlaceholder': 'your@email.com',
    'waitlist.phone': 'Phone (optional)',
    'waitlist.phonePlaceholder': '+261 XX XXX XXXX',
    'waitlist.submitting': 'Joining...',
    'waitlist.submit': 'Join Waitlist',
    'waitlist.successTitle': 'You\'re on the list!',
    'waitlist.successMessage': 'We\'ll notify you when reservations open.',
    'waitlist.errors.noEmail': 'Please enter your email address',
    'waitlist.errors.invalidEmail': 'Please enter a valid email address',
    'waitlist.errors.general': 'Failed to join waitlist. Please try again.',
    'waitlist.success': 'You have been added to the waitlist!',

    // Pedigree & Health
    'pedigree.heading': 'Pedigree & Health',
    'pedigree.intro': 'We test before we breed. Every dog in our program is evaluated for hips, elbows, heart, and temperament. Pedigrees are selected for genetic diversity and breed type.',
    'pedigree.cta': 'Download Health Protocol',
    'pedigree.hips': 'Hips & Elbows',
    'pedigree.hips.desc': 'Screened via PennHIP/OFA; only dogs within acceptable ranges are bred.',
    'pedigree.cardiac': 'Cardiac Screening',
    'pedigree.cardiac.desc': 'Certified clear by a veterinary cardiologist.',
    'pedigree.dna': 'DNA Testing',
    'pedigree.dna.desc': 'Panel testing for breed-relevant conditions; results on file.',
    'pedigree.temperament': 'Temperament Assessment',
    'pedigree.temperament.desc': 'Evaluated for stability, confidence, and trainability.',
    'pedigree.docs': 'Pedigree Documentation',
    'pedigree.docs.desc': 'SABBS-registered lines with clear generational records.',

    // Booking - COMPLET AVEC TOUTES LES CLÉS
    'booking.label': 'Reserve',
    'booking.headline': 'Book a Stud Date',
    'booking.body': 'Select an available date, provide your details, and we\'ll confirm within 24 hours. A deposit secures the reservation.',
    'booking.whatsapp': 'Or message us on WhatsApp',
    'booking.form.title': 'Request a Stud Date',
    'booking.form.name': 'Your Name',
    'booking.form.email': 'Email',
    'booking.form.phone': 'Phone',
    'booking.form.date': 'Preferred Date',
    'booking.form.bitch': 'Bitch\'s Reg Name',
    'booking.form.message': 'Message',
    'booking.form.cta': 'Check Availability',
    'booking.form.selectStud': 'Select Stud',
    'booking.form.bitchRegName': 'Female Dog Registration Name',
    'booking.form.bitchRegNameHelp': 'Official registration name of your female dog',
    'booking.form.bitchName': 'Female Dog Name',
    'booking.form.bitchBreed': 'Breed',
    'booking.form.bitchAge': 'Age',
    'booking.form.previousPregnancies': 'Previous Pregnancies',
    'booking.form.selectOption': '— Select an option —',
    'booking.form.firstTime': '0 (First time)',
    'booking.form.threeOrMore': '3 or more',
    'booking.form.previousPregnanciesHelp': 'Number of previous litters from this female',
    'booking.form.ownerName': 'Owner Name',
    'booking.form.sending': 'Sending...',
    'booking.form.submit': 'Request Booking',
    'booking.availableStud': 'Selected Stud',
    'booking.contactForFee': 'Contact for fee',
    'booking.emailNote': 'A confirmation email will be sent to your email address after booking.',
    'booking.success': 'Booking request sent successfully!',
    'booking.errors.noDate': 'Please select a date',
    'booking.errors.noOwner': 'Please enter your name',
    'booking.errors.noEmail': 'Please enter your email',
    'booking.errors.noPhone': 'Please enter your phone number',
    'booking.errors.noRegName': 'Please enter the female dog registration name',
    'booking.errors.general': 'Failed to submit booking. Please try again.',
    'booking.confirmation.title': 'Booking Request Received!',
    'booking.confirmation.message': 'Thank you for your interest in RR Boerboels stud service.',
    'booking.confirmation.selectedDate': 'Selected Date',
    'booking.confirmation.stud': 'Selected Stud',
    'booking.confirmation.emailSent': 'A confirmation has been sent to your email. We\'ll review your request and get back to you within 24 hours.',
    'booking.confirmation.close': 'Close',

    // Kennel / Meet the Dogs
    'kennel.label': 'The Kennel',
    'kennel.heading': 'Meet the Dogs',
    'kennel.body': 'A small, select group bred for health, type, and temperament.',

    // Visit
    'visit.label': 'Visit',
    'visit.heading': 'See Where They Raise',
    'visit.body': 'We\'re located near Antananarivo, Madagascar. Visitors are welcome by appointment—meet the dogs, see the setup, and ask questions.',
    'visit.appointment': 'By appointment only',
    'visit.kennels': 'Clean, spacious kennels',
    'visit.socialization': 'Puppy socialization area',
    'visit.cta': 'Get Directions',
    'visit.location': 'Location',
    'visit.hours': 'Hours',
    'visit.contact': 'Contact',

    // Testimonials
    'testimonials.quote': 'RR Boerboels gave us more than a puppy—they gave us a guardian who fits perfectly into our family. Professional, honest, and deeply knowledgeable.',
    'testimonials.attribution': '— The Ravalison Family, Antananarivo',

    // Contact
    'contact.label': 'Contact',
    'contact.heading': 'Ready to Meet Your Boerboel?',
    'contact.body': 'Send a message. We\'ll respond within 24 hours.',
    'contact.email': 'Email Us',
    'contact.whatsapp': 'WhatsApp',
    'contact.phone': 'Call Us',
    'contact.address': 'Location',
    'contact.responseTime': 'We typically respond within 24 hours during business days.',
    'contact.form.name': 'Name',
    'contact.form.namePlaceholder': 'Your name',
    'contact.form.email': 'Email',
    'contact.form.emailPlaceholder': 'your@email.com',
    'contact.form.message': 'Message',
    'contact.form.messagePlaceholder': 'Tell us about your interest...',
    'contact.form.submit': 'Send Message',
    'contact.form.sending': 'Sending...',
    'contact.success': 'Message sent successfully!',
    'contact.successTitle': 'Message Sent!',
    'contact.successMessage': 'Thank you for contacting us. We\'ll get back to you within 24 hours.',
    'contact.errorTitle': 'Something went wrong',
    'contact.errorMessage': 'Please try again later or contact us directly via email.',
    'contact.tryAgain': 'Try Again',
    'contact.errors.name': 'Please enter your name',
    'contact.errors.email': 'Please enter your email',
    'contact.errors.emailInvalid': 'Please enter a valid email address',
    'contact.errors.message': 'Please enter your message',
    'contact.errors.general': 'Failed to send message. Please try again.',

    // Products
    'products.label': 'Products',
    'products.heading': 'Premium Products',
    'products.body': 'Quality nutrition and supplements for your Boerboel. Available for purchase at our facility.',
    'products.instore': 'Available In-Store Only',
    'products.visit': 'Visit us to purchase',
    'products.salmonOil': 'Salmon Oil',
    'products.salmonOil.desc': 'Pure salmon oil rich in Omega-3 for healthy coat and joints.',
    'products.kibble': 'Premium Kibble',
    'products.kibble.desc': 'High-protein formula specially formulated for large breeds.',
    'products.supplements': 'Joint Supplements',
    'products.supplements.desc': 'Glucosamine and chondroitin for strong joints and mobility.',
    'products.treats': 'Natural Treats',
    'products.treats.desc': 'All-natural training treats made with real meat.',

    // News
    'news.label': 'News',
    'news.heading': 'Latest News',
    'news.body': 'Stay updated with events, shows, and announcements from the Boerboel community.',
    'news.featured': 'Featured',
    'news.readMore': 'Read More',
    'news.interested': 'Interested in this event?',
    'news.contactUs': 'Contact Us',

    // Footer
    'footer.copyright': '© RR Boerboels',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
  },
  fr: {
    // Navigation
    'nav.males': 'Mâles',
    'nav.females': 'Femelles',
    'nav.litters': 'Portées',
    'nav.products': 'Produits',
    'nav.book': 'Réserver',
    'nav.contact': 'Contact',
    'nav.news': 'Actualité',

    // Hero
    'hero.tagline': 'RR BOERBOELS élève des Boerboels de lignées de haute qualité à Madagascar. Notre programme met l\'accent sur les pedigrees éprouvés, les contrôles vétérinaires rigoureux et la socialisation professionnelle, garantissant que chaque chiot est génétiquement sain, bien équilibré et prêt à remplir son rôle de chien de garde ou de compagnon.',
    'hero.cta.primary': 'Réserver une Saillie',
    'hero.cta.secondary': 'Rencontrer les Chiens',
    'hero.scroll': 'Défiler',

    // Breed
    'breed.label': 'La Race',
    'breed.headline1': 'Conçu pour Garder.',
    'breed.headline2': 'Élevé pour Aimer.',
    'breed.body': 'Le Boerboel est une race de gardien sud-africaine : puissante, confiante et farouchement loyale. Chez RR BOERBOELS, nous élevons exclusivement des Boerboels de haute lignée sélectionnés pour la santé, le type correct et le tempérament stable. Les chiots sont élevés avec une socialisation précoce structurée et une surveillance vétérinaire pour qu\'ils deviennent des gardiens fiables et des compagnons dévoués.',
    'breed.cta': 'Lire Notre Histoire',

    // Featured Male
    'male.label': 'Mâle en Vedette',
    'male.body': "Fils de CDH BULLET - Champion International. Oliver est notre mâle Boerboel exceptionnel, portant la prestigieuse lignée de CDH BULLET, Champion International. Il incarne le standard de la race avec sa constitution puissante, son tempérament confiant et ses excellentes certifications de santé. Oliver est disponible pour des services d'étalon pour femelles approuvées.",
    'male.cta': 'Demander Info Saillie',

    // Featured Female
    'female.label': 'Femelle en Vedette',
    'female.body': "Fille de iCONIC John Wick - Championne Puppy de Madagascar Octobre 2025. Iggy est notre femelle Boerboel exceptionnelle, fille du renommé iCONIC John Wick. Elle a été couronnée Championne Puppy de Madagascar lors du Boerboel Day en octobre 2025, organisé par le Madagascar Boerboel Club. Iggy combine beauté et tempérament exceptionnel, faisant d'elle une représentante idéale de la race et une pierre angulaire future de notre programme d'élevage.",
    'female.cta': 'Voir Sa Pedigree',

    // Litters / Waitlist
    'litters.label': 'Portées à Venir',
    'litters.headline1': 'La Prochaine Génération',
    'litters.headline2': 'Arrive',
    'litters.body': 'Accouplements planifiés avec tests de santé clairs, type fort et tempéraments stables. Rejoignez la liste d\'attente pour être informé quand les réservations ouvrent.',
    'litters.cta': 'Rejoindre la Liste',
    'litters.expectedPairing': 'Accouplement Prévisible',
    'litters.sire': 'Père',
    'litters.dam': 'Mère',
    'litters.expected': 'Prévu pour',
    
    // Gallery
    'gallery.label': 'Galerie des Chiots',
    'gallery.title': 'Portées',
    'gallery.subtitle': 'Précédentes',
    'gallery.description': 'Découvrez nos portées précédentes pour voir la qualité et la beauté des chiots RR Boerboel.',
    'gallery.empty': 'Aucune photo disponible pour le moment',
    
    // Waitlist Dialog
    'waitlist.title': 'Rejoindre la Liste',
    'waitlist.description': 'Soyez le premier informé quand les réservations ouvrent pour notre prochaine portée.',
    'waitlist.name': 'Nom (optionnel)',
    'waitlist.namePlaceholder': 'Votre nom',
    'waitlist.email': 'Adresse Email',
    'waitlist.emailPlaceholder': 'votre@email.com',
    'waitlist.phone': 'Téléphone (optionnel)',
    'waitlist.phonePlaceholder': '+261 XX XXX XXXX',
    'waitlist.submitting': 'Inscription...',
    'waitlist.submit': 'Rejoindre la Liste',
    'waitlist.successTitle': 'Vous êtes sur la liste !',
    'waitlist.successMessage': 'Nous vous informerons quand les réservations ouvriront.',
    'waitlist.errors.noEmail': 'Veuillez entrer votre adresse email',
    'waitlist.errors.invalidEmail': 'Veuillez entrer une adresse email valide',
    'waitlist.errors.general': 'Échec de l\'inscription. Veuillez réessayer.',
    'waitlist.success': 'Vous avez été ajouté à la liste d\'attente !',

    // Pedigree & Health
    'pedigree.heading': 'Pedigree & Santé',
    'pedigree.intro': 'Nous testons avant d\'élever. Chaque chien de notre programme est évalué pour les hanches, coudes, cœur et tempérament. Les pedigrees sont sélectionnés pour la diversité génétique et le type de race.',
    'pedigree.cta': 'Télécharger Protocole Santé',
    'pedigree.hips': 'Hanches & Coudes',
    'pedigree.hips.desc': 'Dépistage via PennHIP/OFA; seuls les chiens dans les plages acceptables sont élevés.',
    'pedigree.cardiac': 'Dépistage Cardiaque',
    'pedigree.cardiac.desc': 'Certifié clair par un cardiologue vétérinaire.',
    'pedigree.dna': 'Test ADN',
    'pedigree.dna.desc': 'Tests panel pour conditions pertinentes à la race; résultats archivés.',
    'pedigree.temperament': 'Évaluation Tempérament',
    'pedigree.temperament.desc': 'Évalué pour stabilité, confiance et dressabilité.',
    'pedigree.docs': 'Documentation Pedigree',
    'pedigree.docs.desc': 'Lignes enregistrées SABBS avec records généalogiques clairs.',

    // Booking - COMPLET AVEC TOUTES LES CLÉS
    'booking.label': 'Réserver',
    'booking.headline': 'Réserver une Saillie',
    'booking.body': 'Sélectionnez une date disponible, fournissez vos coordonnées, et nous confirmerons sous 24 heures. Un acompte sécurise la réservation.',
    'booking.whatsapp': 'Ou messagez-nous sur WhatsApp',
    'booking.form.title': 'Demander une Saillie',
    'booking.form.name': 'Votre Nom',
    'booking.form.email': 'Email',
    'booking.form.phone': 'Téléphone',
    'booking.form.date': 'Date Préférée',
    'booking.form.bitch': 'Nom Reg de la Chienne',
    'booking.form.message': 'Message',
    'booking.form.cta': 'Vérifier Disponibilité',
    'booking.form.selectStud': 'Sélectionner un Étalon',
    'booking.form.bitchRegName': 'Nom d\'Enregistrement de la Chienne',
    'booking.form.bitchRegNameHelp': 'Nom d\'enregistrement officiel de votre chienne',
    'booking.form.bitchName': 'Nom de la Chienne',
    'booking.form.bitchBreed': 'Race',
    'booking.form.bitchAge': 'Âge',
    'booking.form.previousPregnancies': 'Gestations Précédentes',
    'booking.form.selectOption': '— Sélectionnez une option —',
    'booking.form.firstTime': '0 (Première fois)',
    'booking.form.threeOrMore': '3 ou plus',
    'booking.form.previousPregnanciesHelp': 'Nombre de portées précédentes de cette chienne',
    'booking.form.ownerName': 'Nom du Propriétaire',
    'booking.form.sending': 'Envoi...',
    'booking.form.submit': 'Demander une Réservation',
    'booking.availableStud': 'Étalon Sélectionné',
    'booking.contactForFee': 'Contact pour tarif',
    'booking.emailNote': 'Un email de confirmation sera envoyé à votre adresse après la réservation.',
    'booking.success': 'Demande de réservation envoyée avec succès !',
    'booking.errors.noDate': 'Veuillez sélectionner une date',
    'booking.errors.noOwner': 'Veuillez entrer votre nom',
    'booking.errors.noEmail': 'Veuillez entrer votre email',
    'booking.errors.noPhone': 'Veuillez entrer votre numéro de téléphone',
    'booking.errors.noRegName': 'Veuillez entrer le nom d\'enregistrement de la chienne',
    'booking.errors.general': 'Échec de la réservation. Veuillez réessayer.',
    'booking.confirmation.title': 'Demande de Réservation Reçue !',
    'booking.confirmation.message': 'Merci pour votre intérêt pour le service d\'étalon de RR Boerboels.',
    'booking.confirmation.selectedDate': 'Date Sélectionnée',
    'booking.confirmation.stud': 'Étalon Sélectionné',
    'booking.confirmation.emailSent': 'Une confirmation a été envoyée à votre email. Nous examinerons votre demande et vous répondrons sous 24 heures.',
    'booking.confirmation.close': 'Fermer',

    // Kennel / Meet the Dogs
    'kennel.label': 'Le Chenil',
    'kennel.heading': 'Rencontrer les Chiens',
    'kennel.body': 'Un petit groupe sélectionné élevé pour la santé, le type et le tempérament.',

    // Visit
    'visit.label': 'Visiter',
    'visit.heading': 'Voir Où Ils Élèvent',
    'visit.body': 'Nous sommes situés près d\'Antananarivo, Madagascar. Les visiteurs sont les bienvenus sur rendez—vous—rencontrez les chiens, voyez l\'installation, et posez des questions.',
    'visit.appointment': 'Sur rendez-vous uniquement',
    'visit.kennels': 'Chenils propres et spacieux',
    'visit.socialization': 'Aire de socialisation chiots',
    'visit.cta': 'Obtenir Directions',
    'visit.location': 'Lieu',
    'visit.hours': 'Heures',
    'visit.contact': 'Contact',

    // Testimonials
    'testimonials.quote': 'RR Boerboels nous a donné plus qu\'un chiot—ils nous ont donné un gardien qui s\'intègre parfaitement dans notre famille. Professionnel, honnête et profondément compétent.',
    'testimonials.attribution': '— La Famille Ravalison, Antananarivo',

    // Contact
    'contact.label': 'Contact',
    'contact.heading': 'Prêt à Rencontrer Votre Boerboel?',
    'contact.body': 'Envoyez un message. Nous répondrons sous 24 heures.',
    'contact.email': 'Nous Écrire',
    'contact.whatsapp': 'WhatsApp',
    'contact.phone': 'Appelez-nous',
    'contact.address': 'Localisation',
    'contact.responseTime': 'Nous répondons généralement sous 24 heures ouvrables.',
    'contact.form.name': 'Nom',
    'contact.form.namePlaceholder': 'Votre nom',
    'contact.form.email': 'Email',
    'contact.form.emailPlaceholder': 'votre@email.com',
    'contact.form.message': 'Message',
    'contact.form.messagePlaceholder': 'Parlez-nous de votre intérêt...',
    'contact.form.submit': 'Envoyer le Message',
    'contact.form.sending': 'Envoi...',
    'contact.success': 'Message envoyé avec succès !',
    'contact.successTitle': 'Message Envoyé !',
    'contact.successMessage': 'Merci de nous avoir contactés. Nous vous répondrons sous 24 heures.',
    'contact.errorTitle': 'Une erreur est survenue',
    'contact.errorMessage': 'Veuillez réessayer plus tard ou nous contacter directement par email.',
    'contact.tryAgain': 'Réessayer',
    'contact.errors.name': 'Veuillez entrer votre nom',
    'contact.errors.email': 'Veuillez entrer votre email',
    'contact.errors.emailInvalid': 'Veuillez entrer une adresse email valide',
    'contact.errors.message': 'Veuillez entrer votre message',
    'contact.errors.general': 'Échec de l\'envoi du message. Veuillez réessayer.',

    // Products
    'products.label': 'Produits',
    'products.heading': 'Produits Premium',
    'products.body': 'Nutrition de qualité et suppléments pour votre Boerboel. Disponibles à l\'achat dans nos locaux.',
    'products.instore': 'Disponible En Magasin Uniquement',
    'products.visit': 'Visitez-nous pour acheter',
    'products.salmonOil': 'Huile de Saumon',
    'products.salmonOil.desc': 'Huile de saumon pure riche en Oméga-3 pour un pelage sain et des articulations.',
    'products.kibble': 'Croquettes Premium',
    'products.kibble.desc': 'Formule riche en protéines spécialement conçue pour les grandes races.',
    'products.supplements': 'Suppléments Articulaires',
    'products.supplements.desc': 'Glucosamine et chondroïtine pour des articulations solides et la mobilité.',
    'products.treats': 'Friandises Naturelles',
    'products.treats.desc': 'Friandises d\'entraînement 100% naturelles à base de viande réelle.',

    // News
    'news.label': 'Actualité',
    'news.heading': 'Dernières Actualités',
    'news.body': 'Restez informé des événements, expositions et annonces de la communauté Boerboel.',
    'news.featured': 'À la une',
    'news.readMore': 'Lire la suite',
    'news.interested': 'Intéressé par cet événement ?',
    'news.contactUs': 'Contactez-nous',

    // Footer
    'footer.copyright': '© RR Boerboels',
    'footer.privacy': 'Confidentialité',
    'footer.terms': 'Conditions',
  },
  mg: {
    // Navigation
    'nav.males': 'Lahy',
    'nav.females': 'Vavy',
    'nav.litters': 'Zanaka',
    'nav.products': 'Entana',
    'nav.book': 'Famandrihana',
    'nav.contact': 'Fifandraisana',
    'nav.news': 'Vaovao',

    // Hero
    'hero.tagline': 'RR BOERBOELS dia mampiompiana Boerboels avy amin\'ny taranaka tsara indrindra any Madagascar. Ny fandaharam-piompianay dia maneho ny pedigree voamarina, ny fitsapana dokotera hentitra, ary ny fihariana ara-piarahamonim-pianarana, manome antoka fa salama ara-genetika, mitovy tsara, ary vonona hanatanteraka ny anjarany ho alika mpiaro na namana ny zanaka tsirairay.',
    'hero.cta.primary': 'Famandrihana Fanaovana Anaka',
    'hero.cta.secondary': 'Hijery ny Alika',
    'hero.scroll': 'Scroll',

    // Breed
    'breed.label': 'Ny Karazana',
    'breed.headline1': 'Natao Hiaro.',
    'breed.headline2': 'Natao Ho Tia.',
    'breed.body': 'Ny Boerboel dia karazana mpiaro avy any Afrika Atsimo: matanjaka, matoky ary mahatoky fatratra. Any RR BOERBOELS dia mampiompiana Boerboels avy amin\'ny taranaka ambony ihany nofidina ho an\'ny fahasalamana, ny endrika marina, ary ny toetra tsara. Ny zanaka alika dia ampitomboina miaraka amin\'ny fihariana ara-tsosialy voalamina sy ny fikarakarana dokotera mba hahatonga azy ho mpiaro azo antoka sy namana mahatoky.',
    'breed.cta': 'Hamaky ny Tantara',

    // Featured Male
    'male.label': 'Alika Lahy',
    'male.body': "Zanak'i CDH BULLET - Mpampiona Iraisam-pirenena. Oliver dia alika lahy Boerboel mahafinaritra anay, mitondra ny pedigree malaza amin'ny CDH BULLET, Mpampiona Iraisam-pirenena. Maneho ny fenitra karazana izy amin'ny vatany mahery, ny toetrany matoky, ary ny fanamarinana fahasalamana tsara. Misy ho an'ny vehivavy voamarina ny serivisy d'Oliver.",
    'male.cta': 'Mangataka Info',

    // Featured Female
    'female.label': 'Alika Vavy',
    'female.body': "Zanak'i iCONIC John Wick - Mpampiona Zanaka any Madagascar Oktobra 2025. Iggy dia alika vavy Boerboel mahafinaritra anay, zanak'i iCONIC John Wick malaza. Nomena satroka Mpampiona Zanaka any Madagascar tamin'ny Boerboel Day Oktobra 2025 izy, nataon'ny Madagascar Boerboel Club. Mampifangaro ny hatsaran-tarehy sy ny toetra tsara Iggy, ka manao azy ho solontena tsara amin'ny karazana sy vato fehizoro hoavin'ny fandaharam-piompianay.",
    'female.cta': 'Jereo ny Pedigree',

    // Litters / Waitlist
    'litters.label': 'Zanaka Ho Avy',
    'litters.headline1': 'Ny Taranka Manaraka',
    'litters.headline2': 'Ho Avy Tsia',
    'litters.body': 'Fifandimbiasana voalamina miaraka amin\'ny fitsapana fahasalamana, endrika matanjaka, ary toetra tsara. Midira ao amin\'ny lisitra mba hahafantarana rehefa misokatra ny famandrihana.',
    'litters.cta': 'Midira ao amin\'ny Lisitra',
    'litters.expectedPairing': 'Fifandimbiasana Andrasana',
    'litters.sire': 'Ray',
    'litters.dam': 'Reny',
    'litters.expected': 'Andrasana',
    
    // Gallery
    'gallery.label': 'Sarin\'ny Zanaka',
    'gallery.title': 'Taranka',
    'gallery.subtitle': 'Teo Aloha',
    'gallery.description': 'Jereo ny taranka teo aloha mba hahitana ny kalitaon\'ny zanaka RR Boerboel.',
    'gallery.empty': 'Mbola tsy misy sary',
    
    // Waitlist Dialog
    'waitlist.title': 'Midira ao amin\'ny Lisitra',
    'waitlist.description': 'Ianao no ho fantatra aloha rehefa misokatra ny famandrihana.',
    'waitlist.name': 'Anarana (tsy voatery)',
    'waitlist.namePlaceholder': 'Ny anaranao',
    'waitlist.email': 'Adiresy Email',
    'waitlist.emailPlaceholder': 'anaranao@email.com',
    'waitlist.phone': 'Telefaonina (tsy voatery)',
    'waitlist.phonePlaceholder': '+261 XX XXX XXXX',
    'waitlist.submitting': 'Midira...',
    'waitlist.submit': 'Midira ao amin\'ny Lisitra',
    'waitlist.successTitle': 'Tafiditra ao amin\'ny lisitra ianao !',
    'waitlist.successMessage': 'Hampahafantarina anao izahay rehefa misokatra ny famandrihana.',
    'waitlist.errors.noEmail': 'Ampidiro ny adiresy email',
    'waitlist.errors.invalidEmail': 'Ampidiro adiresy email marina',
    'waitlist.errors.general': 'Tsy nahomby ny fidirana. Andramo indray.',
    'waitlist.success': 'Tafiditra ao amin\'ny lisitra ianao !',

    // Pedigree & Health
    'pedigree.heading': 'Pedigree & Fahasalamana',
    'pedigree.intro': 'Izahay dia manao fitsapana alohan\'ny hanaovana fiompiana. Ny alika rehetra dia tsapaina ny hips, elbows, fo, ary toetra. Ny pedigree dia voafantina ho an\'ny fahasamihafana genetika sy karazana.',
    'pedigree.cta': 'Hampiditra Protocol',
    'pedigree.hips': 'Hips & Elbows',
    'pedigree.hips.desc': 'Voatsily amin\'ny PennHIP/OFA; ny alika ao anatin\'ny fetra ihany no ampifandraisina.',
    'pedigree.cardiac': 'Fitsapana Fo',
    'pedigree.cardiac.desc': 'Voamarina tsara amin\'ny dokotera mpanampy.',
    'pedigree.dna': 'Fitsapana ADN',
    'pedigree.dna.desc': 'Fitsapana panel ho an\'ny karazana; ny vokatra dia voatahiry.',
    'pedigree.temperament': 'Fitsapana Toetra',
    'pedigree.temperament.desc': 'Voatsily ho an\'ny fahatokisana, fahatokisana, ary fahafahana mianatra.',
    'pedigree.docs': 'Taratasy Pedigree',
    'pedigree.docs.desc': 'Lalana voasoratra an\'arivon\'ny SABBS miaraka amin\'ny firaketana taranaka mazava.',

    // Booking - COMPLET AVEC TOUTES LES CLÉS
    'booking.label': 'Famandrihana',
    'booking.headline': 'Famandrihana Fanaovana Anaka',
    'booking.body': 'Misafidia daty misy, omeo ny antsipiriany, ary hamarininay ao anatin\'ny 24 ora. Ny vola aloha dia manome antoka ny famandrihana.',
    'booking.whatsapp': 'Na mifandraisa amin\'ny WhatsApp',
    'booking.form.title': 'Mangataka Fanaovana Anaka',
    'booking.form.name': 'Anaranao',
    'booking.form.email': 'Email',
    'booking.form.phone': 'Telefaonina',
    'booking.form.date': 'Daty Tiana',
    'booking.form.bitch': 'Anarana ny Alika Vavy',
    'booking.form.message': 'Hafatra',
    'booking.form.cta': 'Jereo ny Fisiany',
    'booking.form.selectStud': 'Misafidia Alika Lahy',
    'booking.form.bitchRegName': 'Anarana Voasoratry ny Alika Vavy',
    'booking.form.bitchRegNameHelp': 'Anarana ofisialin\'ny alika vavy',
    'booking.form.bitchName': 'Anaran\'ny Alika Vavy',
    'booking.form.bitchBreed': 'Karazana',
    'booking.form.bitchAge': 'Taona',
    'booking.form.previousPregnancies': 'Fiterahana Teo Aloha',
    'booking.form.selectOption': '— Misafidia safidy —',
    'booking.form.firstTime': '0 (Vao voalohany)',
    'booking.form.threeOrMore': '3 na mihoatra',
    'booking.form.previousPregnanciesHelp': 'Isan\'ny zanaka teo aloha tamin\'ity alika vavy ity',
    'booking.form.ownerName': 'Anaran\'ny Tompony',
    'booking.form.sending': 'Mandefa...',
    'booking.form.submit': 'Mangataka Famandrihana',
    'booking.availableStud': 'Alika Lahy Nofidina',
    'booking.contactForFee': 'Mifandraisa ho an\'ny sarany',
    'booking.emailNote': 'Hafatra fanamafisana dia halefa any amin\'ny adiresy emailo aorian\'ny famandrihana.',
    'booking.success': 'Fangatahana famandrihana nalefa soa aman-tsara !',
    'booking.errors.noDate': 'Fidio ny daty',
    'booking.errors.noOwner': 'Ampidiro ny anaranao',
    'booking.errors.noEmail': 'Ampidiro ny email',
    'booking.errors.noPhone': 'Ampidiro ny laharana telefaonina',
    'booking.errors.noRegName': 'Ampidiro ny anaran\'ny alika vavy voasoratra',
    'booking.errors.general': 'Tsy nahomby ny famandrihana. Andramo indray.',
    'booking.confirmation.title': 'Fangatahana Famandrihana Raisina !',
    'booking.confirmation.message': 'Misaotra anao nahaliana ny serivisy famandrihana RR Boerboels.',
    'booking.confirmation.selectedDate': 'Daty Nofidina',
    'booking.confirmation.stud': 'Alika Lahy Nofidina',
    'booking.confirmation.emailSent': 'Ny fanamafisana dia nalefa tany amin\'ny emailo. Hodinihina ny fangatahanao ary hiverina ao anatin\'ny 24 ora.',
    'booking.confirmation.close': 'Akata',

    // Kennel / Meet the Dogs
    'kennel.label': 'Ny Trano Alika',
    'kennel.heading': 'Hijery ny Alika',
    'kennel.body': 'Vondrona kely voafantina ho an\'ny fahasalamana, endrika, ary toetra.',

    // Visit
    'visit.label': 'Tsidiho',
    'visit.heading': 'Jereo Ny Toerana',
    'visit.body': 'Any Antananarivo, Madagascar izahay. Tonga tsara ny mpitsidika amin\'ny alalan\'ny fanomezana fotoana—mifandraisa amin\'ny alika, jereo ny toerana, ary manontania.',
    'visit.appointment': 'Amin\'ny fanomezana fotoana ihany',
    'visit.kennels': 'Trano alika madio sy malalaka',
    'visit.socialization': 'Toerana fihariana zanaka alika',
    'visit.cta': 'Hahita Lalana',
    'visit.location': 'Toerana',
    'visit.hours': 'Ora',
    'visit.contact': 'Fifandraisana',

    // Testimonials
    'testimonials.quote': 'RR Boerboels dia nanome anay mihoatra ny zanaka alika—nanome anay mpiaro izay mifanaraka tsara amin\'ny fianakavianay. Matihanina, marina, ary manana fahalalana lalina.',
    'testimonials.attribution': '— Fianakavia Ravalison, Antananarivo',

    // Contact
    'contact.label': 'Fifandraisana',
    'contact.heading': 'Vonona Hihaona amin\'ny Boerboel?',
    'contact.body': 'Mandefa hafatra. Hamaly anao izahay ao anatin\'ny 24 ora.',
    'contact.email': 'Hafatra Email',
    'contact.whatsapp': 'WhatsApp',
    'contact.phone': 'Antsoy Aho',
    'contact.address': 'Toerana',
    'contact.responseTime': 'Mamaly ao anatin\'ny 24 ora izahay.',
    'contact.form.name': 'Anarana',
    'contact.form.namePlaceholder': 'Ny anaranao',
    'contact.form.email': 'Email',
    'contact.form.emailPlaceholder': 'anaranao@email.com',
    'contact.form.message': 'Hafatra',
    'contact.form.messagePlaceholder': 'Lazao ny antony mahaliana anao...',
    'contact.form.submit': 'Mandefa Hafatra',
    'contact.form.sending': 'Mandefa...',
    'contact.success': 'Hafatra nalefa soa aman-tsara !',
    'contact.successTitle': 'Hafatra Nalefa !',
    'contact.successMessage': 'Misaotra nifandray. Hamaly anao izahay ao anatin\'ny 24 ora.',
    'contact.errorTitle': 'Nisy olana',
    'contact.errorMessage': 'Andramo indray aty aoriana na mifandraisa aminay amin\'ny email.',
    'contact.tryAgain': 'Andramo indray',
    'contact.errors.name': 'Ampidiro ny anaranao',
    'contact.errors.email': 'Ampidiro ny email',
    'contact.errors.emailInvalid': 'Ampidiro adiresy email marina',
    'contact.errors.message': 'Ampidiro ny hafatrao',
    'contact.errors.general': 'Tsy nahomby ny fandefasana. Andramo indray.',

    // Products
    'products.label': 'Entana',
    'products.heading': 'Entana Tsara',
    'products.body': 'Sakafo sy fanampiny ho an\'ny Boerboel-nao. Misy amin\'ny fivarotana.',
    'products.instore': 'Misy Amin\'ny Toerana Fivarotana Fotsiny',
    'products.visit': 'Tsidiho izahay hividianana',
    'products.salmonOil': 'Menaka Salmon',
    'products.salmonOil.desc': 'Menaka salmon madio be Omega-3 ho an\'ny volo salama sy ny hozatra.',
    'products.kibble': 'Kibble Tsara',
    'products.kibble.desc': 'Formula be protéine manokana ho an\'ny karazana lehibe.',
    'products.supplements': 'Fanampiny Hozatra',
    'products.supplements.desc': 'Glucosamine sy chondroïtine ho an\'ny hozatra matanjaka.',
    'products.treats': 'Zaka Voajanahary',
    'products.treats.desc': 'Zaka fiofanana voajanahary vita amin\'ny hena marina.',

    // News
    'news.label': 'Vaovao',
    'news.heading': 'Vaovao Farany',
    'news.body': 'Mijanòna ho fantatra momba ny hetsika, ny fampisehoana, ary ny fanambarana avy amin\'ny vondrona Boerboel.',
    'news.featured': 'Mampiavaka',
    'news.readMore': 'Vakio bebe kokoa',
    'news.interested': 'Tia io hetsika io?',
    'news.contactUs': 'Mifandraisa aminay',

    // Footer
    'footer.copyright': '© RR Boerboels',
    'footer.privacy': 'Tsiambaratelo',
    'footer.terms': 'Fepetra',
  },
  es: {
    // Navigation
    'nav.males': 'Machos',
    'nav.females': 'Hembras',
    'nav.litters': 'Camadas',
    'nav.products': 'Productos',
    'nav.book': 'Reservar',
    'nav.contact': 'Contacto',
    'nav.news': 'Noticias',

    // Hero
    'hero.tagline': 'RR BOERBOELS cría Boerboels de líneas de sangre de alta calidad en Madagascar. Nuestro programa enfatiza pedigrees probados, controles veterinarios rigurosos y socialización profesional, asegurando que cada cachorro sea genéticamente saludable, bien equilibrado y listo para cumplir su rol como perro guardián o compañero.',
    'hero.cta.primary': 'Reservar un Semental',
    'hero.cta.secondary': 'Conocer los Perros',
    'hero.scroll': 'Desplazar',

    // Breed
    'breed.label': 'La Raza',
    'breed.headline1': 'Construido para Proteger.',
    'breed.headline2': 'Criado para Amar.',
    'breed.body': 'El Boerboel es una raza guardiana sudafricana: poderosa, confiada y ferozmente leal. En RR BOERBOELS criamos exclusivamente Boerboels de línea alta seleccionados por salud, tipo correcto y temperamento estable. Los cachorros se crían con socialización temprana estructurada y supervisión veterinaria para que se desarrollen como guardianes confiables y compañeros devotos.',
    'breed.cta': 'Leer Nuestra Historia',

    // Featured Male
    'male.label': 'Macho Destacado',
    'male.body': "Hijo de CDH BULLET - Campeón Internacional. Oliver es nuestro macho Boerboel excepcional, portando el prestigioso pedigree de CDH BULLET, Campeón Internacional. Él ejemplifica el estándar de la raza con su constitución poderosa, temperamento confiado y excelentes certificaciones de salud. Oliver está disponible para servicios de semental para hembras aprobadas.",
    'male.cta': 'Solicitar Info del Semental',

    // Featured Female
    'female.label': 'Hembra Destacada',
    'female.body': "Hija de iCONIC John Wick - Campeona Cachorro de Madagascar Octubre 2025. Iggy es nuestra hembra Boerboel excepcional, hija del renombrado iCONIC John Wick. Fue coronada Campeona Cachorro de Madagascar en el Boerboel Day de octubre 2025, organizado por el Madagascar Boerboel Club. Iggy combina belleza con un temperamento excepcional, haciéndola una representante ideal de la raza y una piedra angular futura de nuestro programa de cría.",
    'female.cta': 'Ver Su Pedigree',

    // Litters / Waitlist
    'litters.label': 'Próximas Camadas',
    'litters.headline1': 'La Próxima Generación',
    'litters.headline2': 'Está Llegando',
    'litters.body': 'Emparejamientos planificados con pruebas de salud claras, tipo fuerte y temperamentos estables. Únete a la lista de espera para ser notificado cuando abran las reservas.',
    'litters.cta': 'Unirse a la Lista',
    'litters.expectedPairing': 'Emparejamiento Previsto',
    'litters.sire': 'Padre',
    'litters.dam': 'Madre',
    'litters.expected': 'Previsto',
    
    // Gallery
    'gallery.label': 'Galería de Cachorros',
    'gallery.title': 'Camadas',
    'gallery.subtitle': 'Anteriores',
    'gallery.description': 'Echa un vistazo a nuestras camadas anteriores para ver la calidad y belleza de los cachorros RR Boerboel.',
    'gallery.empty': 'No hay fotos disponibles por el momento',
    
    // Waitlist Dialog
    'waitlist.title': 'Unirse a la Lista',
    'waitlist.description': 'Sea el primero en saber cuándo se abren las reservas para nuestra próxima camada.',
    'waitlist.name': 'Nombre (opcional)',
    'waitlist.namePlaceholder': 'Tu nombre',
    'waitlist.email': 'Correo Electrónico',
    'waitlist.emailPlaceholder': 'tu@email.com',
    'waitlist.phone': 'Teléfono (opcional)',
    'waitlist.phonePlaceholder': '+261 XX XXX XXXX',
    'waitlist.submitting': 'Uniéndose...',
    'waitlist.submit': 'Unirse a la Lista',
    'waitlist.successTitle': '¡Estás en la lista!',
    'waitlist.successMessage': 'Te notificaremos cuando se abran las reservas.',
    'waitlist.errors.noEmail': 'Por favor ingrese su correo electrónico',
    'waitlist.errors.invalidEmail': 'Por favor ingrese un correo electrónico válido',
    'waitlist.errors.general': 'Error al unirse a la lista. Por favor intente de nuevo.',
    'waitlist.success': '¡Has sido añadido a la lista de espera!',

    // Pedigree & Health
    'pedigree.heading': 'Pedigree y Salud',
    'pedigree.intro': 'Probamos antes de criar. Cada perro en nuestro programa es evaluado para caderas, codos, corazón y temperamento. Los pedigrees se seleccionan por diversidad genética y tipo de raza.',
    'pedigree.cta': 'Descargar Protocolo de Salud',
    'pedigree.hips': 'Caderas y Codos',
    'pedigree.hips.desc': 'Evaluados via PennHIP/OFA; solo perros dentro de rangos aceptables son criados.',
    'pedigree.cardiac': 'Evaluación Cardíaca',
    'pedigree.cardiac.desc': 'Certificado claro por un cardiólogo veterinario.',
    'pedigree.dna': 'Prueba de ADN',
    'pedigree.dna.desc': 'Panel de pruebas para condiciones relevantes a la raza; resultados archivados.',
    'pedigree.temperament': 'Evaluación de Temperamento',
    'pedigree.temperament.desc': 'Evaluado para estabilidad, confianza y capacidad de entrenamiento.',
    'pedigree.docs': 'Documentación de Pedigree',
    'pedigree.docs.desc': 'Líneas registradas SABBS con registros generacionales claros.',

    // Booking - COMPLET AVEC TOUTES LES CLÉS
    'booking.label': 'Reservar',
    'booking.headline': 'Reservar un Semental',
    'booking.body': 'Selecciona una fecha disponible, proporciona tus datos, y confirmaremos dentro de 24 horas. Un depósito asegura la reserva.',
    'booking.whatsapp': 'O escríbenos por WhatsApp',
    'booking.form.title': 'Solicitar un Semental',
    'booking.form.name': 'Tu Nombre',
    'booking.form.email': 'Email',
    'booking.form.phone': 'Teléfono',
    'booking.form.date': 'Fecha Preferida',
    'booking.form.bitch': 'Nombre Reg de la Perra',
    'booking.form.message': 'Mensaje',
    'booking.form.cta': 'Verificar Disponibilidad',
    'booking.form.selectStud': 'Seleccionar Semental',
    'booking.form.bitchRegName': 'Nombre de Registro de la Perra',
    'booking.form.bitchRegNameHelp': 'Nombre de registro oficial de su perra',
    'booking.form.bitchName': 'Nombre de la Perra',
    'booking.form.bitchBreed': 'Raza',
    'booking.form.bitchAge': 'Edad',
    'booking.form.previousPregnancies': 'Gestaciones Anteriores',
    'booking.form.selectOption': '— Seleccione una opción —',
    'booking.form.firstTime': '0 (Primera vez)',
    'booking.form.threeOrMore': '3 o más',
    'booking.form.previousPregnanciesHelp': 'Número de camadas anteriores de esta perra',
    'booking.form.ownerName': 'Nombre del Propietario',
    'booking.form.sending': 'Enviando...',
    'booking.form.submit': 'Solicitar Reserva',
    'booking.availableStud': 'Semental Seleccionado',
    'booking.contactForFee': 'Contactar para tarifa',
    'booking.emailNote': 'Se enviará un correo de confirmación a su dirección de correo electrónico después de la reserva.',
    'booking.success': '¡Solicitud de reserva enviada con éxito!',
    'booking.errors.noDate': 'Por favor seleccione una fecha',
    'booking.errors.noOwner': 'Por favor ingrese su nombre',
    'booking.errors.noEmail': 'Por favor ingrese su correo electrónico',
    'booking.errors.noPhone': 'Por favor ingrese su número de teléfono',
    'booking.errors.noRegName': 'Por favor ingrese el nombre de registro de la perra',
    'booking.errors.general': 'Error al enviar la reserva. Por favor intente de nuevo.',
    'booking.confirmation.title': '¡Solicitud de Reserva Recibida!',
    'booking.confirmation.message': 'Gracias por su interés en el servicio de semental de RR Boerboels.',
    'booking.confirmation.selectedDate': 'Fecha Seleccionada',
    'booking.confirmation.stud': 'Semental Seleccionado',
    'booking.confirmation.emailSent': 'Se ha enviado una confirmación a su correo electrónico. Revisaremos su solicitud y le responderemos dentro de 24 horas.',
    'booking.confirmation.close': 'Cerrar',

    // Kennel / Meet the Dogs
    'kennel.label': 'El Kennel',
    'kennel.heading': 'Conoce los Perros',
    'kennel.body': 'Un pequeño grupo selecto criado para salud, tipo y temperamento.',

    // Visit
    'visit.label': 'Visitar',
    'visit.heading': 'Ver Dónde Criamos',
    'visit.body': 'Estamos ubicados cerca de Antananarivo, Madagascar. Los visitantes son bienvenidos con cita previa—conoce los perros, ve la instalación y haz preguntas.',
    'visit.appointment': 'Solo con cita previa',
    'visit.kennels': 'Kennels limpios y espaciosos',
    'visit.socialization': 'Área de socialización de cachorros',
    'visit.cta': 'Obtener Direcciones',
    'visit.location': 'Ubicación',
    'visit.hours': 'Horas',
    'visit.contact': 'Contacto',

    // Testimonials
    'testimonials.quote': 'RR Boerboels nos dio más que un cachorro—nos dio un guardián que encaja perfectamente en nuestra familia. Profesional, honesto y profundamente conocedor.',
    'testimonials.attribution': '— La Familia Ravalison, Antananarivo',

    // Contact
    'contact.label': 'Contacto',
    'contact.heading': '¿Listo para Conocer tu Boerboel?',
    'contact.body': 'Envía un mensaje. Responderemos dentro de 24 horas.',
    'contact.email': 'Email',
    'contact.whatsapp': 'WhatsApp',
    'contact.phone': 'Llámanos',
    'contact.address': 'Ubicación',
    'contact.responseTime': 'Normalmente respondemos dentro de 24 horas laborables.',
    'contact.form.name': 'Nombre',
    'contact.form.namePlaceholder': 'Tu nombre',
    'contact.form.email': 'Email',
    'contact.form.emailPlaceholder': 'tu@email.com',
    'contact.form.message': 'Mensaje',
    'contact.form.messagePlaceholder': 'Cuéntanos sobre tu interés...',
    'contact.form.submit': 'Enviar Mensaje',
    'contact.form.sending': 'Enviando...',
    'contact.success': '¡Mensaje enviado con éxito!',
    'contact.successTitle': '¡Mensaje Enviado!',
    'contact.successMessage': 'Gracias por contactarnos. Le responderemos dentro de 24 horas.',
    'contact.errorTitle': 'Algo salió mal',
    'contact.errorMessage': 'Por favor intente de nuevo más tarde o contáctenos directamente por email.',
    'contact.tryAgain': 'Intentar de nuevo',
    'contact.errors.name': 'Por favor ingrese su nombre',
    'contact.errors.email': 'Por favor ingrese su correo electrónico',
    'contact.errors.emailInvalid': 'Por favor ingrese una dirección de correo electrónico válida',
    'contact.errors.message': 'Por favor ingrese su mensaje',
    'contact.errors.general': 'Error al enviar el mensaje. Por favor intente de nuevo.',

    // Products
    'products.label': 'Productos',
    'products.heading': 'Productos Premium',
    'products.body': 'Nutrición de calidad y suplementos para tu Boerboel. Disponibles para compra en nuestras instalaciones.',
    'products.instore': 'Disponible Solo En Tienda',
    'products.visit': 'Visítanos para comprar',
    'products.salmonOil': 'Aceite de Salmón',
    'products.salmonOil.desc': 'Aceite de salmón puro rico en Omega-3 para pelaje saludable y articulaciones.',
    'products.kibble': 'Croquetas Premium',
    'products.kibble.desc': 'Fórmula alta en proteínas especialmente formulada para razas grandes.',
    'products.supplements': 'Suplementos Articulares',
    'products.supplements.desc': 'Glucosamina y condroitina para articulaciones fuertes y movilidad.',
    'products.treats': 'Golosinas Naturales',
    'products.treats.desc': 'Golosinas de entrenamiento 100% naturales hechas con carne real.',

    // News
    'news.label': 'Noticias',
    'news.heading': 'Últimas Noticias',
    'news.body': 'Mantente actualizado con eventos, exposiciones y anuncios de la comunidad Boerboel.',
    'news.featured': 'Destacado',
    'news.readMore': 'Leer Más',
    'news.interested': '¿Interesado en este evento?',
    'news.contactUs': 'Contáctanos',

    // Footer
    'footer.copyright': '© RR Boerboels',
    'footer.privacy': 'Privacidad',
    'footer.terms': 'Términos',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Récupérer la langue sauvegardée ou utiliser 'en' par défaut
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved && ['en', 'fr', 'mg', 'es'].includes(saved) ? saved : 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = 'ltr';
    localStorage.setItem('language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    // Récupérer la traduction
    const translation = translations[language]?.[key];
    
    if (translation === undefined) {
      // Fallback vers l'anglais si la traduction n'existe pas
      const fallback = translations.en[key];
      if (fallback === undefined) {
        console.warn(`Translation missing for key: ${key} in language: ${language}`);
        return key;
      }
      return fallback;
    }
    return translation;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export type { Language };
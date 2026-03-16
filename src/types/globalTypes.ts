export interface appDataType {
  professionalsFullName: string;
  apptDate: Date | number;
  uuid: number;
  clientName: string;
  waiting: boolean;
}

export interface offerType {
  uniqueId: string;
  offer: any;
  professionalsFullName: string;
  clientName: string;
  apptDate: Date;
  offererIceCandidates: any;
  answer: any;
  answererIceCandidates: any;
}

export interface connectedProfessionalType {
  socketId: string;
  fullName: string;
  proId: string;
}

export interface connectedClientType {
  clientName: string;
  uuid: string;
  professionalMeetingWith: string;
  socketId: string;
}

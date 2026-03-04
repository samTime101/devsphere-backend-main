export interface Member{
    name : string;
    role : string;
    avatarUrl : string;
    year : Date;
    status? : "ACTIVE" | "INACTIVE";
    discordUrl? : string;
    instagramUrl? : string;
    linkedinUrl? : string;
}


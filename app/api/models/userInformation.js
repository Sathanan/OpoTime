class UserInformation {
    constructor({
        id,
        first_name,
        last_name,
        email,
        phone,
        job,
        location,
        user_timezone,
        languages,
        bio,
        joined_at,
        profile_picture
    } = {}) {
        this.id = id;
        this.user = user;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone = phone;
        this.job = job;
        this.location = location;
        this.user_timezone = user_timezone;
        this.languages = languages;
        this.bio = bio;
        this.joined_at = joined_at;
        this.profile_picture = profile_picture;
    }
}

export default UserInformation;

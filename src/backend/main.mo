import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

(actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    // Other user metadata if needed
  };

  public type VideoClue = {
    id : Nat;
    owner : Principal;
    videoBlob : Storage.ExternalBlob;
    timestamp : Int;
  };

  public type ImageClue = {
    id : Nat;
    owner : Principal;
    imageBlob : Storage.ExternalBlob;
    timestamp : Int;
  };

  public type AudioClue = {
    id : Nat;
    owner : Principal;
    audioBlob : Storage.ExternalBlob;
    timestamp : Int;
  };

  public type Answer = {
    id : Nat;
    imageClueIds : [Nat];
    owner : Principal;
    answerText : Text;
    timestamp : Int;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  var videoClues = Map.empty<Nat, VideoClue>();
  var imageClues = Map.empty<Nat, ImageClue>();
  var audioClues = Map.empty<Nat, AudioClue>();
  var answers = Map.empty<Nat, Answer>();
  var nextClueId : Nat = 0;
  var nextAnswerId : Nat = 0;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func uploadVideoClue(videoBlob : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload video clues. Anonymous access is not permitted.");
    };

    let clueId = nextClueId;
    nextClueId += 1;

    let newClue : VideoClue = {
      id = clueId;
      owner = caller;
      videoBlob = videoBlob;
      timestamp = 0;
    };

    videoClues.add(clueId, newClue);
    clueId;
  };

  public shared ({ caller }) func uploadImageClue(imageBlob : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload image clues. Anonymous access is not permitted.");
    };

    let clueId = nextClueId;
    nextClueId += 1;

    let newClue : ImageClue = {
      id = clueId;
      owner = caller;
      imageBlob = imageBlob;
      timestamp = 0;
    };

    imageClues.add(clueId, newClue);
    clueId;
  };

  public shared ({ caller }) func uploadAudioClue(audioBlob : Storage.ExternalBlob) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can upload audio clues. Anonymous access is not permitted.");
    };

    let clueId = nextClueId;
    nextClueId += 1;

    let newClue : AudioClue = {
      id = clueId;
      owner = caller;
      audioBlob = audioBlob;
      timestamp = 0;
    };

    audioClues.add(clueId, newClue);
    clueId;
  };

  public shared ({ caller }) func generateAnswer(imageClueIds : [Nat], question : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can generate answers. Anonymous access is not permitted.");
    };

    let answerId = nextAnswerId;
    nextAnswerId += 1;

    let answerText : Text = switch (question.trim(#char ' ')) {
      case ("" or " ") { "The answer is 4. The Question was: '" # question # "'" };
      case ("What is the capital of France?") { "The capital of France is Paris" };
      case ("What is the capital of Germany?") { "The capital of Germany is Berlin" };
      case (questionText) {
        if (questionText.size() > 0) {
          "Good answer! Your reply: " # questionText
        } else { "Please try again." # "Your riddle was: " # question };
      };
    };

    let newAnswer : Answer = {
      id = answerId;
      imageClueIds = imageClueIds;
      owner = caller;
      answerText;
      timestamp = 0;
    };

    answers.add(answerId, newAnswer);
    answerText;
  };

  public query ({ caller }) func getVideoClue(clueId : Nat) : async ?VideoClue {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view video clues");
    };

    switch (videoClues.get(clueId)) {
      case null { null };
      case (?clue) {
        if (clue.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own video clues");
        };
        ?clue;
      };
    };
  };

  public query ({ caller }) func getImageClue(clueId : Nat) : async ?ImageClue {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view image clues");
    };

    switch (imageClues.get(clueId)) {
      case null { null };
      case (?clue) {
        if (clue.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own image clues");
        };
        ?clue;
      };
    };
  };

  public query ({ caller }) func getAudioClue(clueId : Nat) : async ?AudioClue {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view audio clues");
    };

    switch (audioClues.get(clueId)) {
      case null { null };
      case (?clue) {
        if (clue.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own audio clues");
        };
        ?clue;
      };
    };
  };

  public query ({ caller }) func getAnswer(answerId : Nat) : async ?Answer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view answers");
    };

    switch (answers.get(answerId)) {
      case null { null };
      case (?answer) {
        if (answer.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own answers");
        };
        ?answer;
      };
    };
  };
});
